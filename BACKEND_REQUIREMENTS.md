# Digital Masjid Screen - Backend Requirements

## Overview
The backend system needs to support a Progressive Web Application (PWA) that displays prayer times, hadith, and announcements for masjid screens. The system must be reliable, performant, and handle multiple masjids with different configurations.

## Core Requirements

### 1. Database Schema

#### Prayer Times Table
```sql
CREATE TABLE prayer_times (
    id INT PRIMARY KEY AUTO_INCREMENT,
    masjid_id INT NOT NULL,
    date DATE NOT NULL,
    fajr TIME NOT NULL,
    fajr_jamaat TIME NOT NULL,
    sunrise TIME,
    zuhr TIME NOT NULL,
    zuhr_jamaat TIME NOT NULL,
    asr TIME NOT NULL,
    asr_jamaat TIME NOT NULL,
    maghrib TIME NOT NULL,
    maghrib_jamaat TIME NOT NULL,
    isha TIME NOT NULL,
    isha_jamaat TIME NOT NULL,
    jummah_khutbah TIME,
    jummah_jamaat TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date_masjid (date, masjid_id)
);
```

#### Hadith Table
```sql
CREATE TABLE hadith (
    id INT PRIMARY KEY AUTO_INCREMENT,
    masjid_id INT NOT NULL,
    arabic_text TEXT,
    english_text TEXT,
    display_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Announcements Table
```sql
CREATE TABLE announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    masjid_id INT NOT NULL,
    message TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Masjids Table
```sql
CREATE TABLE masjids (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    calculation_method VARCHAR(50) DEFAULT 'MWL',
    madhab VARCHAR(20) DEFAULT 'Hanafi',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Users Table
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    masjid_id INT NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. API Endpoints

#### Authentication
- `POST /api/auth/login`
  - Authenticates user and returns JWT token
  - Rate limited to prevent brute force attacks

#### Prayer Times
- `GET /api/prayer-times/:masjid_id/today`
  - Returns today's prayer times
- `GET /api/prayer-times/:masjid_id/tomorrow`
  - Returns tomorrow's prayer times
- `GET /api/prayer-times/:masjid_id/range`
  - Query params: start_date, end_date
  - Returns prayer times for date range
- `POST /api/prayer-times/:masjid_id/bulk`
  - Accepts CSV upload for bulk prayer times
- `PUT /api/prayer-times/:masjid_id/:date`
  - Updates specific prayer times

#### Hadith
- `GET /api/hadith/:masjid_id/today`
  - Returns today's hadith
- `POST /api/hadith/:masjid_id`
  - Creates new hadith
- `PUT /api/hadith/:id`
  - Updates existing hadith
- `DELETE /api/hadith/:id`
  - Deactivates hadith

#### Announcements
- `GET /api/announcements/:masjid_id/active`
  - Returns current active announcements
- `POST /api/announcements/:masjid_id`
  - Creates new announcement
- `PUT /api/announcements/:id`
  - Updates existing announcement
- `DELETE /api/announcements/:id`
  - Deactivates announcement

### 3. Core Features

#### Prayer Time Calculations
- Implement prayer time calculation using established libraries (e.g., Adhan.js)
- Support different calculation methods (MWL, ISNA, etc.)
- Handle Madhab differences for Asr times
- Account for DST changes
- Support manual adjustments to calculated times

#### Data Synchronization
- Implement efficient caching strategy
- Use WebSockets for real-time updates
- Implement offline support with service workers
- Handle conflict resolution for concurrent updates

#### Security
- JWT-based authentication
- Role-based access control
- Rate limiting on all endpoints
- Input validation and sanitization
- HTTPS enforcement
- CORS configuration
- SQL injection prevention

### 4. Performance Requirements

#### Response Times
- API responses < 200ms for simple queries
- Bulk operations < 2s
- Real-time updates < 100ms

#### Caching
- Redis/Memcached for frequently accessed data
- Client-side caching with service workers
- Cache invalidation strategy

#### Database
- Indexes on frequently queried columns
- Optimized query performance
- Regular database maintenance

### 5. Scalability

#### Horizontal Scaling
- Stateless application design
- Load balancer configuration
- Database replication strategy

#### Monitoring
- System health metrics
- Error tracking and logging
- Performance monitoring
- Usage analytics

### 6. Backup and Recovery

#### Data Backup
- Daily automated backups
- Point-in-time recovery capability
- Backup verification process

#### Disaster Recovery
- Failover strategy
- Data center redundancy
- Recovery time objectives (RTO)
- Recovery point objectives (RPO)

### 7. Integration Requirements

#### External Services
- Prayer time calculation service
- SMS/Email notification system (optional)
- Analytics service
- Error tracking service

#### Webhooks
- Support for custom integrations
- Event notifications
- Status updates

## Development Requirements

### Environment Setup
- Development environment
- Staging environment
- Production environment
- CI/CD pipeline

### Documentation
- API documentation (OpenAPI/Swagger)
- Database schema documentation
- Setup and deployment guides
- Integration guides

### Testing
- Unit tests
- Integration tests
- Load tests
- Security tests

## Deployment Requirements

### Infrastructure
- Containerized deployment (Docker)
- Container orchestration (Kubernetes optional)
- SSL certificate management
- Domain and DNS management

### Monitoring
- Uptime monitoring
- Performance monitoring
- Error tracking
- Usage analytics

### Maintenance
- Regular security updates
- Database maintenance
- Backup verification
- Performance optimization

## Future Considerations

### Potential Extensions
- Multi-language support
- Multiple screen layouts
- Advanced analytics
- Mobile app integration
- Community features
- Automated announcements
- Integration with other Islamic services 