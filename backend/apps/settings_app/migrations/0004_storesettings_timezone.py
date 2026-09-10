from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('settings_app', '0003_add_subpage_settings')]
    operations = [migrations.AddField(
        model_name='storesettings', name='timezone', field=models.CharField(default='UTC', max_length=100),
    )]
