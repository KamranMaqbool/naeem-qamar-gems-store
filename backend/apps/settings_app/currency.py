"""Safe, server-side conversion of the store's monetary data."""

import json
from decimal import Decimal, ROUND_HALF_UP
from urllib.request import urlopen

from django.db import transaction


class CurrencyConversionError(Exception):
    """Raised when a reliable market rate cannot be obtained."""


def _latest_rate(source_currency, target_currency):
    if source_currency == target_currency:
        return Decimal('1')

    try:
        with urlopen(
            f'https://api.frankfurter.dev/v2/rate/{source_currency.lower()}/{target_currency.lower()}',
            timeout=8,
        ) as response:
            payload = json.loads(response.read().decode('utf-8'))
        rate = Decimal(str(payload['rate']))
    except Exception as exc:  # pragma: no cover - depends on external service
        raise CurrencyConversionError(
            'Could not obtain a live exchange rate. Your prices were not changed; please try again.'
        ) from exc

    if rate <= 0:
        raise CurrencyConversionError('The exchange-rate provider returned an invalid rate.')
    return rate


def _convert(value, rate):
    if value is None:
        return None
    return (Decimal(value) * rate).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


def convert_store_money(source_currency, target_currency):
    """Convert all persisted monetary values as one atomic operation.

    The conversion is deliberately server-side. The browser only chooses the
    target currency and never supplies a rate or rewritten monetary values.
    """
    source = source_currency.upper().strip()
    target = target_currency.upper().strip()
    rate = _latest_rate(source, target)

    from apps.catalog.models import Product
    from apps.discounts.models import DiscountCode
    from apps.orders.models import Order, OrderItem
    from apps.payments.models import Payment

    with transaction.atomic():
        from apps.settings_app.models import StoreSettings

        for product in Product.objects.all().iterator():
            product.base_price = _convert(product.base_price, rate)
            product.sale_price = _convert(product.sale_price, rate)
            product.save(update_fields=['base_price', 'sale_price'])

        for discount in DiscountCode.objects.filter(discount_type=DiscountCode.DiscountType.FIXED_AMOUNT).iterator():
            discount.value = _convert(discount.value, rate)
            discount.min_purchase_amount = _convert(discount.min_purchase_amount, rate)
            discount.max_discount_amount = _convert(discount.max_discount_amount, rate)
            discount.save(update_fields=['value', 'min_purchase_amount', 'max_discount_amount'])

        for order in Order.objects.all().iterator():
            order.subtotal = _convert(order.subtotal, rate)
            order.discount_amount = _convert(order.discount_amount, rate)
            order.tax_amount = _convert(order.tax_amount, rate)
            order.shipping_cost = _convert(order.shipping_cost, rate)
            order.total_amount = _convert(order.total_amount, rate)
            order.save(update_fields=['subtotal', 'discount_amount', 'tax_amount', 'shipping_cost', 'total_amount'])

        for item in OrderItem.objects.all().iterator():
            item.unit_price_at_purchase = _convert(item.unit_price_at_purchase, rate)
            item.save(update_fields=['unit_price_at_purchase'])

        for payment in Payment.objects.all().iterator():
            payment.amount = _convert(payment.amount, rate)
            payment.currency = target
            payment.save(update_fields=['amount', 'currency'])

        settings_obj = StoreSettings.load()
        settings_obj.free_shipping_threshold = _convert(settings_obj.free_shipping_threshold, rate)
        settings_obj.save(update_fields=['free_shipping_threshold', 'updated_at'])

    return rate
