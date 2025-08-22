class AuthenticationError(Exception):
    pass

class EntityNotFoundError(Exception):
    pass

class ValidationError(Exception):
    pass

class DuplicateEntityError(Exception):
    pass

class NotFoundException(Exception):
    """Excepción lanzada cuando no se encuentra una entidad."""
    pass

class ConflictException(Exception):
    """Excepción lanzada cuando hay un conflicto (ej: duplicados)."""
    pass
