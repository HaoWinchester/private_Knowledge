from __future__ import annotations

from datetime import date


def retention_until(start: date | None = None, *, years: int = 3) -> date:
    base = start or date.today()
    try:
        return base.replace(year=base.year + years)
    except ValueError:
        return base.replace(month=2, day=28, year=base.year + years)
