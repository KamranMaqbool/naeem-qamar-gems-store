import random
from datetime import timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.utils.text import slugify

from apps.accounts.models import Address, User
from apps.catalog.models import Category, GemstoneAttributes, Product, ProductImage
from apps.discounts.models import DiscountCode
from apps.inventory.models import Inventory
from apps.orders.models import Order, OrderItem
from apps.settings_app.models import StoreSettings


class Command(BaseCommand):
    help = 'Seed the database with sample data for Virtuoso\'s Gems'

    def handle(self, *args, **options):
        self._create_superuser()
        categories = self._create_categories()
        products = self._create_products(categories)
        self._create_inventory(products)
        self._create_store_settings()
        self._create_sample_customers()
        self._create_sample_orders(products)
        self._create_discount_code()
        self.stdout.write(self.style.SUCCESS('Seed data created successfully!'))

    # ------------------------------------------------------------------
    # Superuser
    # ------------------------------------------------------------------
    def _create_superuser(self):
        user, created = User.objects.get_or_create(
            email='admin@virtuoso-gems.com',
            defaults={
                'username': 'admin',
                'role': User.Role.SUPER_ADMIN,
                'is_staff': True,
                'is_superuser': True,
            },
        )
        if created:
            user.set_password('admin123')
            user.save()
            self.stdout.write(self.style.SUCCESS('Created superuser: admin@virtuoso-gems.com'))
        else:
            self.stdout.write(self.style.WARNING('Superuser already exists: admin@virtuoso-gems.com'))

    # ------------------------------------------------------------------
    # Categories
    # ------------------------------------------------------------------
    def _create_categories(self):
        category_names = [
            'Loose Gemstones',
            'Rings',
            'Necklaces',
            'Earrings',
            'Bracelets',
        ]
        categories = {}
        for name in category_names:
            cat, created = Category.objects.get_or_create(
                slug=slugify(name),
                defaults={'name': name},
            )
            categories[cat.slug] = cat
            status = 'Created' if created else 'Already exists'
            self.stdout.write(self.style.SUCCESS(f'{status} category: {name}'))
        return categories

    # ------------------------------------------------------------------
    # Products
    # ------------------------------------------------------------------
    def _create_products(self, categories):
        products_data = [
            {
                'title': 'Ceylon Sapphire',
                'sku': 'LUX-SA-001',
                'base_price': 12500,
                'category_slug': 'loose-gemstones',
                'status': 'PUBLISHED',
                'is_featured': False,
                'tags': 'New Arrival',
                'description': 'A stunning 3.15ct cushion-cut Ceylon sapphire with exceptional clarity and vivid blue hue.',
                'gemstone': {
                    'carat_weight': 3.15,
                    'cut_shape': 'Cushion Cut',
                    'color_grade': 'Vivid Royal Blue',
                    'clarity_grade': 'Eye Clean (VVS1)',
                    'origin_country': 'Sri Lanka (Ceylon)',
                    'certification_lab': 'GIA',
                    'treatment': 'None (Unheated)',
                    'precious_metal': 'Loose Stone',
                },
                'image_url': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKewHUQbwVF5HHTQJWvEuL8tvqJdcN1u41bOIfuWSLUMJ_fw3dfvNrIFEw9r89BzxF9JZJTfCkHKnDW_QNSyRVMrZ-X029zJTp53mrZ_13QdirabQgK4QfAmayrWK_UZ6hBbtv2VTHWwk84Y0OO_M3aWaqgVgj80qwAlOCgr19x92MpI3_uzqaWZU8TzSNApiMy8SBgZvmEMeavUIj0j0P6B4kP8l4gGpE2QAyJDk6c6whIhxztGzJ',
            },
            {
                'title': 'Burmese Ruby',
                'sku': 'LUX-RU-001',
                'base_price': 18200,
                'category_slug': 'loose-gemstones',
                'status': 'PUBLISHED',
                'is_featured': False,
                'tags': 'Rare Find',
                'description': 'An exquisite 1.50ct pigeon blood ruby from Myanmar with deep red saturation.',
                'gemstone': {
                    'carat_weight': 1.50,
                    'cut_shape': 'Oval Cut',
                    'color_grade': 'Pigeon Blood Red',
                    'clarity_grade': 'Eye Clean',
                    'origin_country': 'Myanmar (Burma)',
                    'certification_lab': 'GIA',
                    'treatment': 'Heat Treated',
                    'precious_metal': 'Loose Stone',
                },
                'image_url': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxKAmBIR0MAftZpjKdpmfC4XBHPlVgpZwtEH16Au4_n_ymh8wuT1ASNlF9C9q-sy3gjbzyTmhuXtlm-H7Fd8wUz8xiylzy1FVRN3E8RO5yibaG_Cu4Z6GaO73C0QTc7E6rZM0yoZVwxkMcfR26sIyVcyfl0LVZTpwpLoyPvYhZCGXcEt0Y0_n3hyRG-fnFZd7T3TVQWexn8pf_QgWsSg1uX6YLed46cXqaW304i2NhfrYwu6WaBvgO',
            },
            {
                'title': 'Colombian Emerald',
                'sku': 'LUX-EM-001',
                'base_price': 9800,
                'category_slug': 'loose-gemstones',
                'status': 'PUBLISHED',
                'is_featured': False,
                'tags': '',
                'description': 'A magnificent 2.50ct pear-cut Colombian emerald with lush green color.',
                'gemstone': {
                    'carat_weight': 2.50,
                    'cut_shape': 'Pear Cut',
                    'color_grade': 'Vivid Green',
                    'clarity_grade': 'Minor Inclusions',
                    'origin_country': 'Colombia',
                    'certification_lab': 'GIA',
                    'treatment': 'Minor Oil',
                    'precious_metal': 'Loose Stone',
                },
                'image_url': 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6hfMj2z27VvR9Bj4Wn895Hmq1WB7fUCKd6P1QFk5CGPKVktiuZYmRkIZSHlmoeHO9sNkrDN-sffL1KVRNP5nBArFZoyCOpper6M_-IDKv00F9PB-cbAjMoXXH9zuQde_-WAc-rdbS_fVBhpCy1wcQdNabRvGvSRZkTm78zusNJyrTa6wbVw5WPtyIn44BhS0rJKVg5eyePr_V3TYJKd9rxYcE3YrN2IpkMTK3SYG6e4uVuqIMNjDk',
            },
            {
                'title': 'Flawless Diamond',
                'sku': 'LUX-DM-001',
                'base_price': 45000,
                'category_slug': 'loose-gemstones',
                'status': 'PUBLISHED',
                'is_featured': False,
                'tags': '',
                'description': 'A breathtaking 3.00ct round brilliant flawless diamond with exceptional fire.',
                'gemstone': {
                    'carat_weight': 3.00,
                    'cut_shape': 'Round Brilliant',
                    'color_grade': 'D (Colorless)',
                    'clarity_grade': 'IF (Internally Flawless)',
                    'origin_country': 'Botswana',
                    'certification_lab': 'GIA',
                    'treatment': 'None',
                    'precious_metal': 'Loose Stone',
                },
                'image_url': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG5TuhG5OFNPwqpB0HF_pbKiOwfjXdRD4_aD-I822w3oCOHuomSUrZ_uHMwm-coTtuhGai3AQ4EooFOApZAduQ0GBOuir-V9gzcNE7hntl5agyqX3es-5bsIxJ2BY2V21tfPisImRs8-PhUwmB1XhAaw209s4BUK5XeK8j3J0anrYVAY5XgPMVo61rX8291whU5QuG6Vkat-hUOitSjczODbyzXfn2rVaiEzMtFuXzArewoSb4h3sH',
            },
            {
                'title': 'Yellow Sapphire',
                'sku': 'LUX-SA-002',
                'base_price': 15400,
                'category_slug': 'loose-gemstones',
                'status': 'PUBLISHED',
                'is_featured': False,
                'tags': '',
                'description': 'A stunning 4.10ct emerald-cut yellow sapphire with vibrant canary yellow hue.',
                'gemstone': {
                    'carat_weight': 4.10,
                    'cut_shape': 'Emerald Cut',
                    'color_grade': 'Vivid Canary Yellow',
                    'clarity_grade': 'Eye Clean',
                    'origin_country': 'Sri Lanka',
                    'certification_lab': 'GIA',
                    'treatment': 'None (Unheated)',
                    'precious_metal': 'Loose Stone',
                },
                'image_url': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvEThfrrdtCo0dGDAUlEmGwWkoGKRYqJp-GOXUVUO2aKnSuxd3j2wEI-mylLGR0RgdoSr4jre070aRXQ6NlCoB4icyM9b7vmT42WAuikO5EdKT0eQD8KERCAvHZOWgxVNsrBP7Gk8Il5ep3y-BnqzOMwKhDjfaI2bqvwRuFNoGX2GbzTbO1j3e94Sy0BBUvPjBhGtPw0p4lP8XX0hJVAWdoDFnTVzvf58zdIldzx25oCSZ6j7CGWhX',
            },
            {
                'title': 'Fancy Pink Diamond',
                'sku': 'LUX-DM-002',
                'base_price': 85000,
                'category_slug': 'loose-gemstones',
                'status': 'PUBLISHED',
                'is_featured': False,
                'tags': '',
                'description': 'An extremely rare 2.05ct radiant-cut fancy pink diamond.',
                'gemstone': {
                    'carat_weight': 2.05,
                    'cut_shape': 'Radiant Cut',
                    'color_grade': 'Fancy Intense Pink',
                    'clarity_grade': 'VS1',
                    'origin_country': 'Australia',
                    'certification_lab': 'GIA',
                    'treatment': 'None',
                    'precious_metal': 'Loose Stone',
                },
                'image_url': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuUKktorrJNjm4BDWqfWXnBMB0D8klsZz5tlan6liORgFcrTLv0Mpip1hzfiI8Js2O-MQct56xb2-3nAMw2g6xrMt3-fyfFCItEpvcwKYeoqf7xpvWjRvY4gqqHGZ_abhzyPtoXguFVXBOvWcGRvdz8jRiYU1mF1yIHTQgJNCuOX7h4MUEDr9exc9w_RrAL6MWelMIBnjA4UVQCiaLHZVREjNIKuLs2-Cr8o0hKAeQi6ibld89SPHx',
            },
            {
                'title': '2-Carat Ceylon Sapphire',
                'sku': 'LUX-SA-003',
                'base_price': 4500,
                'category_slug': 'loose-gemstones',
                'status': 'PUBLISHED',
                'is_featured': True,
                'tags': 'FEATURED',
                'description': 'Ethically sourced from the legendary mines of Sri Lanka, known for their vivid royal blue hue and exceptional clarity.',
                'gemstone': {
                    'carat_weight': 2.01,
                    'cut_shape': 'Cushion Cut',
                    'color_grade': 'Vivid Royal Blue',
                    'clarity_grade': 'Eye Clean (VVS1)',
                    'origin_country': 'Sri Lanka (Ceylon)',
                    'certification_lab': 'GIA',
                    'treatment': 'None (Unheated)',
                    'precious_metal': 'Loose Stone',
                },
                'image_url': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKewHUQbwVF5HHTQJWvEuL8tvqJdcN1u41bOIfuWSLUMJ_fw3dfvNrIFEw9r89BzxF9JZJTfCkHKnDW_QNSyRVMrZ-X029zJTp53mrZ_13QdirabQgK4QfAmayrWK_UZ6hBbtv2VTHWwk84Y0OO_M3aWaqgVgj80qwAlOCgr19x92MpI3_uzqaWZU8TzSNApiMy8SBgZvmEMeavUIj0j0P6B4kP8l4gGpE2QAyJDk6c6whIhxztGzJ',
            },
            # Jewelry items
            {
                'title': 'Emerald Cut Diamond Ring',
                'sku': 'LUX-RG-001',
                'base_price': 12500,
                'sale_price': 11200,
                'category_slug': 'rings',
                'status': 'PUBLISHED',
                'is_featured': True,
                'tags': '',
                'description': 'A stunning emerald cut diamond set in 18k white gold.',
                'gemstone': {
                    'carat_weight': 2.00,
                    'cut_shape': 'Emerald Cut',
                    'color_grade': 'F',
                    'clarity_grade': 'VS1',
                    'origin_country': 'Botswana',
                    'certification_lab': 'GIA',
                    'precious_metal': '18k White Gold',
                },
                'image_url': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG5TuhG5OFNPwqpB0HF_pbKiOwfjXdRD4_aD-I822w3oCOHuomSUrZ_uHMwm-coTtuhGai3AQ4EooFOApZAduQ0GBOuir-V9gzcNE7hntl5agyqX3es-5bsIxJ2BY2V21tfPisImRs8-PhUwmB1XhAaw209s4BUK5XeK8j3J0anrYVAY5XgPMVo61rX8291whU5QuG6Vkat-hUOitSjczODbyzXfn2rVaiEzMtFuXzArewoSb4h3sH',
            },
            {
                'title': 'Ceylon Sapphire Pendant',
                'sku': 'LUX-NK-002',
                'base_price': 8900,
                'category_slug': 'necklaces',
                'status': 'PUBLISHED',
                'is_featured': False,
                'tags': '',
                'description': 'An elegant Ceylon sapphire pendant on a fine gold chain.',
                'gemstone': {
                    'carat_weight': 1.50,
                    'cut_shape': 'Oval Cut',
                    'color_grade': 'Royal Blue',
                    'origin_country': 'Sri Lanka',
                    'certification_lab': 'GIA',
                    'precious_metal': '18k Yellow Gold',
                },
                'image_url': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKewHUQbwVF5HHTQJWvEuL8tvqJdcN1u41bOIfuWSLUMJ_fw3dfvNrIFEw9r89BzxF9JZJTfCkHKnDW_QNSyRVMrZ-X029zJTp53mrZ_13QdirabQgK4QfAmayrWK_UZ6hBbtv2VTHWwk84Y0OO_M3aWaqgVgj80qwAlOCgr19x92MpI3_uzqaWZU8TzSNApiMy8SBgZvmEMeavUIj0j0P6B4kP8l4gGpE2QAyJDk6c6whIhxztGzJ',
            },
            {
                'title': 'Pigeon Blood Ruby Earrings',
                'sku': 'LUX-ER-003',
                'base_price': 18200,
                'sale_price': 16500,
                'category_slug': 'earrings',
                'status': 'PUBLISHED',
                'is_featured': False,
                'tags': '',
                'description': 'Exquisite pigeon blood ruby drop earrings in platinum setting.',
                'gemstone': {
                    'carat_weight': 1.20,
                    'cut_shape': 'Pear Cut',
                    'color_grade': 'Pigeon Blood',
                    'origin_country': 'Myanmar',
                    'certification_lab': 'AIGS',
                    'precious_metal': 'Platinum',
                },
                'image_url': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxKAmBIR0MAftZpjKdpmfC4XBHPlVgpZwtEH16Au4_n_ymh8wuT1ASNlF9C9q-sy3gjbzyTmhuXtlm-H7Fd8wUz8xiylzy1FVRN3E8RO5yibaG_Cu4Z6GaO73C0QTc7E6rZM0yoZVwxkMcfR26sIyVcyfl0LVZTpwpLoyPvYhZCGXcEt0Y0_n3hyRG-fnFZd7T3TVQWexn8pf_QgWsSg1uX6YLed46cXqaW304i2NhfrYwu6WaBvgO',
            },
        ]

        created_products = []
        for data in products_data:
            gemstone_data = data.pop('gemstone')
            image_url = data.pop('image_url')
            category_slug = data.pop('category_slug')

            product, created = Product.objects.get_or_create(
                sku=data['sku'],
                defaults={
                    'title': data['title'],
                    'slug': slugify(data['title']),
                    'description': data.get('description', ''),
                    'base_price': Decimal(str(data['base_price'])),
                    'sale_price': Decimal(str(data['sale_price'])) if data.get('sale_price') else None,
                    'is_featured': data.get('is_featured', False),
                    'status': data.get('status', 'DRAFT'),
                    'category': categories.get(category_slug),
                    'tags': data.get('tags', ''),
                },
            )

            if created:
                # Gemstone attributes
                GemstoneAttributes.objects.get_or_create(
                    product=product,
                    defaults={
                        'carat_weight': Decimal(str(gemstone_data.get('carat_weight', 0))),
                        'cut_shape': gemstone_data.get('cut_shape', ''),
                        'color_grade': gemstone_data.get('color_grade', ''),
                        'clarity_grade': gemstone_data.get('clarity_grade', ''),
                        'origin_country': gemstone_data.get('origin_country', ''),
                        'certification_lab': gemstone_data.get('certification_lab', ''),
                        'treatment': gemstone_data.get('treatment', ''),
                        'precious_metal': gemstone_data.get('precious_metal', ''),
                    },
                )

                # Product image
                ProductImage.objects.get_or_create(
                    product=product,
                    is_primary=True,
                    defaults={
                        'image_url': image_url,
                        'alt_text': data['title'],
                        'display_order': 0,
                    },
                )

                self.stdout.write(self.style.SUCCESS(f'Created product: {data["title"]}'))
            else:
                self.stdout.write(self.style.WARNING(f'Product already exists: {data["title"]}'))

            created_products.append(product)

        return created_products

    # ------------------------------------------------------------------
    # Inventory
    # ------------------------------------------------------------------
    def _create_inventory(self, products):
        for product in products:
            stock = random.randint(5, 25)
            inv, created = Inventory.objects.get_or_create(
                product=product,
                defaults={
                    'current_stock': stock,
                    'low_stock_threshold': 5,
                    'stock_status': 'IN_STOCK' if stock > 5 else 'LOW_STOCK',
                },
            )
            status = 'Created' if created else 'Already exists'
            self.stdout.write(self.style.SUCCESS(f'{status} inventory for: {product.title} (stock: {inv.current_stock})'))

    # ------------------------------------------------------------------
    # Store Settings
    # ------------------------------------------------------------------
    def _create_store_settings(self):
        settings = StoreSettings.load()
        settings.store_name = "Virtuoso's Gems"
        settings.contact_email = 'info@virtuoso-gems.com'
        settings.contact_phone = '+1 (555) 888-9900'
        settings.default_currency = 'USD'
        settings.tax_rate_percentage = Decimal('8.50')
        settings.free_shipping_threshold = Decimal('500.00')
        settings.order_prefix = 'GEM-'
        settings.save()
        self.stdout.write(self.style.SUCCESS('Created/updated store settings'))

    # ------------------------------------------------------------------
    # Sample customers
    # ------------------------------------------------------------------
    def _create_sample_customers(self):
        customers_data = [
            {
                'email': 'sarah.johnson@example.com',
                'username': 'sarah_j',
                'first_name': 'Sarah',
                'last_name': 'Johnson',
                'phone_number': '+1 (555) 123-4567',
            },
            {
                'email': 'james.chen@example.com',
                'username': 'james_c',
                'first_name': 'James',
                'last_name': 'Chen',
                'phone_number': '+1 (555) 234-5678',
            },
            {
                'email': 'maria.garcia@example.com',
                'username': 'maria_g',
                'first_name': 'Maria',
                'last_name': 'Garcia',
                'phone_number': '+1 (555) 345-6789',
            },
        ]

        for cdata in customers_data:
            user, created = User.objects.get_or_create(
                email=cdata['email'],
                defaults={
                    'username': cdata['username'],
                    'first_name': cdata['first_name'],
                    'last_name': cdata['last_name'],
                    'phone_number': cdata['phone_number'],
                    'role': User.Role.CUSTOMER,
                },
            )
            if created:
                user.set_password('customer123')
                user.save()
                # Default shipping address
                Address.objects.get_or_create(
                    user=user,
                    is_default_shipping=True,
                    defaults={
                        'street_address': f'{random.randint(100, 9999)} Main St',
                        'city': random.choice(['New York', 'Los Angeles', 'Chicago', 'Houston']),
                        'state': random.choice(['NY', 'CA', 'IL', 'TX']),
                        'postal_code': f'{random.randint(10000, 99999)}',
                        'country': 'United States',
                        'is_default_billing': True,
                    },
                )
                self.stdout.write(self.style.SUCCESS(f'Created customer: {cdata["email"]}'))
            else:
                self.stdout.write(self.style.WARNING(f'Customer already exists: {cdata["email"]}'))

    # ------------------------------------------------------------------
    # Sample orders
    # ------------------------------------------------------------------
    def _create_sample_orders(self, products):
        customers = User.objects.filter(role=User.Role.CUSTOMER)
        if not customers.exists():
            self.stdout.write(self.style.WARNING('No customers found, skipping orders'))
            return

        orders_data = [
            {
                'status': 'COMPLETED',
                'days_ago': 15,
                'product_indices': [0, 2],
            },
            {
                'status': 'PROCESSING',
                'days_ago': 3,
                'product_indices': [3],
            },
            {
                'status': 'SHIPPED',
                'days_ago': 7,
                'product_indices': [1, 4],
            },
            {
                'status': 'PENDING',
                'days_ago': 1,
                'product_indices': [7, 8],
            },
        ]

        for i, odata in enumerate(orders_data):
            order_number = f'GEM-{1001 + i:04d}'
            if Order.objects.filter(order_number=order_number).exists():
                self.stdout.write(self.style.WARNING(f'Order already exists: {order_number}'))
                continue

            customer = customers[i % customers.count()]
            address = customer.addresses.first()
            address_dict = {
                'street_address': address.street_address if address else '123 Main St',
                'city': address.city if address else 'New York',
                'state': address.state if address else 'NY',
                'postal_code': address.postal_code if address else '10001',
                'country': address.country if address else 'United States',
            }

            # Calculate totals
            order_products = [products[idx] for idx in odata['product_indices'] if idx < len(products)]
            subtotal = sum(p.sale_price or p.base_price for p in order_products)
            tax = subtotal * Decimal('0.085')
            shipping = Decimal('0') if subtotal >= 500 else Decimal('25.00')
            total = subtotal + tax + shipping

            order = Order(
                order_number=order_number,
                user=customer,
                shipping_address=address_dict,
                billing_address=address_dict,
                subtotal=subtotal,
                tax_amount=tax.quantize(Decimal('0.01')),
                shipping_cost=shipping,
                total_amount=total.quantize(Decimal('0.01')),
                order_status=odata['status'],
            )
            order.save()

            for product in order_products:
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    unit_price_at_purchase=product.sale_price or product.base_price,
                    quantity=1,
                )

            self.stdout.write(self.style.SUCCESS(
                f'Created order: {order_number} ({odata["status"]}) - ${total:.2f}'
            ))

    # ------------------------------------------------------------------
    # Discount code
    # ------------------------------------------------------------------
    def _create_discount_code(self):
        now = timezone.now()
        code, created = DiscountCode.objects.get_or_create(
            code='WELCOME10',
            defaults={
                'discount_type': DiscountCode.DiscountType.PERCENTAGE,
                'value': Decimal('10.00'),
                'min_purchase_amount': Decimal('100.00'),
                'start_date': now,
                'end_date': now + timedelta(days=365),
                'max_uses': 0,
                'is_active': True,
            },
        )
        status = 'Created' if created else 'Already exists'
        self.stdout.write(self.style.SUCCESS(f'{status} discount code: WELCOME10 (10% off, min $100)'))
