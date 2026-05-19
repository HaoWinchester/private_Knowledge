# Security Hardening Checklist

- Keep all production services inside the private network.
- Require bearer authentication at the API gateway before exposing backend routes.
- Store original documents in private object storage buckets with server-side encryption.
- Keep strictly controlled knowledge metadata-only until explicit approval.
- Retain audit, approval, access, and service-call records for at least 3 years.
- Rotate pilot application keys after every pilot phase or suspected exposure.
- Back up PostgreSQL and object storage before migration or data import.
