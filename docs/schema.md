erDiagram
    TEAMS ||--o{ EMPLOYEES : "belongs to"
    EMPLOYEES ||--o{ BOOKINGS : "makes"
    DESKS ||--o{ BOOKINGS : "reserved via"
    ROOMS ||--o{ BOOKINGS : "reserved via"

    TEAMS {
        int team_id PK "Unique ID"
        string team_name "Team name"
        string team_department "Department name"
    }

    EMPLOYEES {
        int employee_id PK "Unique ID"
        string employee_name "Full name"
        string employee_email "Email address"
        int team_id FK "Links to TEAMS"
    }

    DESKS {
        int desk_id PK "Unique ID"
        string desk_label "e.g., Desk-04"
        boolean has_dual_monitors "Equipment check"
    }

    ROOMS {
        int room_id PK "Unique ID"
        string room_name "e.g., Boardroom"
        int capacity "Seat count"
    }

    BOOKINGS {
        int booking_id PK "Unique transaction ID"
        int employee_id FK "Links to EMPLOYEES"
        int desk_id FK "Links to DESKS (Optional)"
        int room_id FK "Links to ROOMS (Optional)"
        datetime start_time "Start reservation"
        datetime end_time "End reservation"
    }

