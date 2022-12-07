from decimal import Decimal

from django.db import models
from django.db.models import TextChoices


class PlanetEnum(TextChoices):
    MERCURY = 'mercury'
    VENUS = 'venus'
    EARTH = 'earth'
    MARS = 'mars'
    JUPITER = 'jupiter'
    SATURN = 'saturn'
    URANUS = 'uranus'
    NEPTUNE = 'neptune'


class Planet(models.Model):
    enum = models.CharField(max_length=8, choices=PlanetEnum.choices)
    number = models.PositiveIntegerField()
    name = models.CharField(max_length=32)
    token_id = models.PositiveIntegerField()
    sun_distance = models.DecimalField(max_digits=32, decimal_places=0)
    weight = models.DecimalField(max_digits=32, decimal_places=0)
    price = models.DecimalField(max_digits=32, decimal_places=18)

    @property
    def emission(self):
        return self.price

    @property
    def link(self):
        return '/planets/{}'.format(self.enum)

    def __str__(self):
        return self.name


class Country(models.Model):
    number = models.PositiveIntegerField()
    name = models.CharField(max_length=32)
    token_id = models.PositiveIntegerField()
    code = models.CharField(max_length=8)
    gdp = models.DecimalField(max_digits=32, decimal_places=0)
    area = models.DecimalField(max_digits=32, decimal_places=0)
    population = models.DecimalField(max_digits=32, decimal_places=0)
    crypto_index = models.PositiveIntegerField()
    image = models.ImageField(null=True, blank=True)
    price = models.DecimalField(max_digits=32, decimal_places=18)

    @property
    def emission(self):
        return (self.gdp / Decimal('1e8') + self.area / Decimal('1e3') + self.population / Decimal('1e3')) * self.crypto_index

    @property
    def link(self):
        return '/planets/earth/{}'.format(self.number)

    def __str__(self):
        return self.name
