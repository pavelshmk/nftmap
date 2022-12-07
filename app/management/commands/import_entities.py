import json
from decimal import Decimal

from django.conf import settings
from django.core.management import BaseCommand

from app.models import Planet, Country


class Command(BaseCommand):
    def handle(self, *args, **options):
        with open(settings.BASE_DIR / 'tokens.json') as f:
            data = json.load(f)

        Planet.objects.all().delete()
        Country.objects.all().delete()
        for i, (name, planet) in enumerate(data['Planets'].items(), 1):
            Planet.objects.create(
                name=name,
                number=i,
                enum=name.lower(),
                token_id=1000000 + i,
                sun_distance=f"{Decimal(planet['distance_from_sun']):.0f}",
                price=50,
                weight=f"{Decimal(planet['weight']):.0f}",
            )
        for i, (name, country) in enumerate(data['Countries'].items(), 1):
            Country.objects.create(
                name=name,
                number=i,
                token_id=i,
                code=country['country_code'],
                gdp=country['gdp_2019'].replace(',', ''),
                area=country['square_km2'].replace(',', ''),
                population=country['population'].replace(',', ''),
                crypto_index=country['crypto_index'],
                price=50,
            )
