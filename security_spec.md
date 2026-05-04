# Security Specification - MessMate

## Data Invariants
1. A user profile must match the authenticated UID.
2. A mess can only be created by a user with the 'MessOwner' role.
3. Attendance and payments must belong to the student who is being tracked.
4. A MessOwner can only access data (menus, attendance, payments) for their own mess.
5. RBAC fields (role, status) can only be modified by admins.
6. Mess approval status can only be modified by admins.

## The Dirty Dozen Payloads

### 1. Identity Spoofing (User Profile)
Attempt to create a user profile with a different UID than the authenticated one.
```json
{
  "uid": "victim_uid",
  "role": "Student",
  "status": "approved",
  "name": "Attacker"
}
```
**Expected:** PERMISSION_DENIED

### 2. Privilege Escalation (User Role)
Attempt to update own role to 'Admin'.
```json
{
  "role": "Admin"
}
```
**Expected:** PERMISSION_DENIED

### 3. Orphaned Mess (Invalid Owner)
Attempt to create a mess with an ownerId that is not the authenticated user.
```json
{
  "ownerId": "victim_uid",
  "name": "Stolen Mess",
  "status": "pending"
}
```
**Expected:** PERMISSION_DENIED

### 4. Shadow Mess Approval
Attempt to update mess status to 'approved' by the owner (should be admin only).
```json
{
  "status": "approved"
}
```
**Expected:** PERMISSION_DENIED

### 5. Cross-Mess Menu Poisoning
Attempt to update a menu for a different mess.
```json
{
  "breakfast": "Malicious Script"
}
```
**Expected:** PERMISSION_DENIED

### 6. Identity Theft (Student Attendance)
Attempt to mark attendance for a different student.
```json
{
  "studentId": "victim_uid",
  "messId": "my_mess_id",
  "date": "2024-05-01",
  "mealType": "lunch",
  "status": "present"
}
```
**Expected:** PERMISSION_DENIED

### 7. Ghost Payment Creation
Attempt to create a payment record as a student (should be owner only).
```json
{
  "studentId": "my_uid",
  "messId": "my_mess_id",
  "amount": 100,
  "month": "May",
  "year": 2024,
  "status": "paid"
}
```
**Expected:** PERMISSION_DENIED

### 8. Denial of Wallet (Large String Injection)
Attempt to inject a 1MB string into a mess address field.
```json
{
  "address": "A".repeat(1024 * 1024)
}
```
**Expected:** PERMISSION_DENIED

### 9. Illegal List Scraping (Users)
Attempt to list all users as a regular student.
Query: `collection(db, 'users')`
**Expected:** PERMISSION_DENIED

### 10. Temporal Integrity Breach (Future Timestamp)
Attempt to set a future `updatedAt` instead of `request.time`.
```json
{
  "updatedAt": "2030-01-01T00:00:00Z"
}
```
**Expected:** PERMISSION_DENIED

### 11. Resource Poisoning (Invalid ID characters)
Attempt to create a document with an invalid ID like "mess/123".
**Expected:** PERMISSION_DENIED (via regex matching)

### 12. PII Leak (Private Email Access)
Attempt to read the email of another user.
**Expected:** PERMISSION_DENIED
