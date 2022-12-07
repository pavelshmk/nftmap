import graphene
from django.db.models import Max
from eth_account.messages import encode_defunct
from graphene_django import DjangoListField, DjangoObjectType
from graphql import GraphQLError
from web3 import Web3

from app.models import Planet, Country


class PlanetType(DjangoObjectType):
    emission = graphene.Decimal(required=True)

    class Meta:
        model = Planet
        fields = 'enum', 'number', 'name', 'token_id', 'sun_distance', 'weight', 'price', 'emission',
        convert_choices_to_enum = False


class CountryType(DjangoObjectType):
    emission = graphene.Decimal(required=True)

    class Meta:
        model = Country
        fields = 'number', 'name', 'token_id', 'code', 'gdp', 'area', 'population', 'crypto_index', 'image', 'price', 'emission',


class EntityType(graphene.ObjectType):
    name = graphene.String()
    image = graphene.String(required=False)
    token_id = graphene.String()
    link = graphene.String()


class Query(graphene.ObjectType):
    planets = DjangoListField(PlanetType)
    countries = DjangoListField(CountryType)
    max_country_price = graphene.Decimal()
    token_mint_args = graphene.List(graphene.String, buyer=graphene.String(), token_id=graphene.Int())
    entities_info = graphene.List(EntityType, token_ids=graphene.List(graphene.String))

    def resolve_planets(self, info):
        return Planet.objects.all()

    def resolve_countries(self, info):
        return Country.objects.all()

    def resolve_max_country_price(self, info):
        return Country.objects.aggregate(max_price=Max('price'))['max_price'] or 0

    def resolve_token_mint_args(self, info, buyer, token_id):
        try:
            entity = Planet.objects.get(token_id=token_id)
        except Planet.DoesNotExist:
            try:
                entity = Country.objects.get(token_id=token_id)
            except Country.DoesNotExist:
                raise GraphQLError('not_found')

        args = [
            int(token_id),
            int(entity.price * 10**18),
            int(entity.emission * 10**18 / 365),
            'http://dev.bennnnsss.com:36519/_meta/{}_{}.json'.format('planet' if isinstance(entity, Planet) else 'country', token_id),
        ]
        hash_args = [Web3.toChecksumAddress(buyer)] + args + ['0x9D39c12fF663E0B918c41C33436bC9D8dD6024fD']
        h = Web3.soliditySha3(['address', 'uint256', 'uint256', 'uint256', 'string', 'address'], hash_args)
        msg = encode_defunct(h)
        signed = Web3().eth.account.sign_message(msg, 'd7d17e266c0aeabaf841216ea6bcc4e2bf3693d57a94884611e1e948367ce5a3')
        return args + [signed.signature.hex()]

    def resolve_entities_info(self, info, token_ids):
        return list(Planet.objects.filter(token_id__in=token_ids)) + list(Country.objects.filter(token_id__in=token_ids))


schema = graphene.Schema(query=Query)
