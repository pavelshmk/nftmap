from django.contrib import admin

from app.models import Planet, Country


@admin.register(Planet)
class PlanetAdmin(admin.ModelAdmin):
    pass


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    pass
