from typing import Dict, Optional

from app.models.user import User


class UserRepository:
    def __init__(self) -> None:
        self._users: Dict[str, User] = {}

    def get_by_id(self, user_id: str) -> Optional[User]:
        return self._users.get(user_id)

    def save(self, user: User) -> User:
        self._users[user.id] = user
        return user


# Singleton instance
user_repository = UserRepository()
