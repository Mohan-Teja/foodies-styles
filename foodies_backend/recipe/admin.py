from django.contrib import admin
from .models import Listing


class ListingAdmin(admin.ModelAdmin):
    using = 'listings'
    list_display = ('id', 'title', 'contributor_email', 'slug' )
    list_display_links = ('id', 'contributor_email', 'title', 'slug', )
    list_filter = ('contributor_email', )
    search_fields = ('title', 'description', )
    list_per_page = 25
    
admin.site.register(Listing, ListingAdmin)