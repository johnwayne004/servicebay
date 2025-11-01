import os
from django.core.management.base import BaseCommand
from users.models import CustomUser

class Command(BaseCommand):
        help = 'Creates a new superuser non-interactively.'

        def handle(self, *args, **options):
            email = os.environ.get('ADMIN_EMAIL')
            password = os.environ.get('ADMIN_PASSWORD')
            
            if not email or not password:
                self.stdout.write(self.style.ERROR('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are not set.'))
                return

            if CustomUser.objects.filter(email=email).exists():
                self.stdout.write(self.style.WARNING(f'Admin user with email {email} already exists.'))
            else:
                CustomUser.objects.create_superuser(
                    email=email,
                    password=password,
                    first_name='Admin',
                    last_name='User',
                    phone_number='0000000'
                )
                self.stdout.write(self.style.SUCCESS(f'Successfully created new admin user: {email}'))
    