from django.core.management.base import BaseCommand

from apps.accounts.models import User


class Command(BaseCommand):
    help = 'Create or update the default Virtuoso Gems super administrator.'

    def handle(self, *args, **options):
        user, created = User.objects.get_or_create(
            email='admin@virtuoso-gems.com',
            defaults={'username': 'admin', 'role': User.Role.SUPER_ADMIN},
        )
        user.username = 'admin'
        user.role = User.Role.SUPER_ADMIN
        user.is_staff = True
        user.is_superuser = True
        user.set_password('admin123')
        user.save()
        self.stdout.write(self.style.SUCCESS(f"Super admin {'created' if created else 'updated'}: admin@virtuoso-gems.com / admin123"))
