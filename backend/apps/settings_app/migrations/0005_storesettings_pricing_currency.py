from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('settings_app', '0004_storesettings_timezone')]

    operations = [
        migrations.AddField(
            model_name='storesettings',
            name='pricing_currency',
            field=models.CharField(default='USD', max_length=10),
        ),
    ]
