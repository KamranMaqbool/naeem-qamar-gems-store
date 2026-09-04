from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('settings_app', '0002_alter_storesettings_logo_url')]

    operations = [
        migrations.AddField(model_name='storesettings', name='payment_settings', field=models.JSONField(blank=True, default=dict)),
        migrations.AddField(model_name='storesettings', name='shipping_settings', field=models.JSONField(blank=True, default=dict)),
        migrations.AddField(model_name='storesettings', name='notification_settings', field=models.JSONField(blank=True, default=dict)),
    ]
