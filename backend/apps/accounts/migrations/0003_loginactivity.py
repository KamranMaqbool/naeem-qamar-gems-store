from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [('accounts', '0002_alter_user_avatar')]
    operations = [migrations.CreateModel(
        name='LoginActivity',
        fields=[
            ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ('ip_address', models.GenericIPAddressField(blank=True, null=True)),
            ('user_agent', models.CharField(blank=True, max_length=500)),
            ('created_at', models.DateTimeField(auto_now_add=True)),
            ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='login_activities', to='accounts.user')),
        ],
        options={'ordering': ['-created_at']},
    )]
