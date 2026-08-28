from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrStaff(BasePermission):
    """Allow access only to users whose role is SUPER_ADMIN or STAFF."""

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return getattr(request.user, 'role', None) in ('SUPER_ADMIN', 'STAFF')


class IsOwnerOrReadOnly(BasePermission):
    """Object-level: allow the owner full access, everyone else read-only."""

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        # Check common owner field names.
        return getattr(obj, 'user', None) == request.user or \
               getattr(obj, 'owner', None) == request.user
