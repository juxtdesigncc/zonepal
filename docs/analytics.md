# PostHog Analytics Implementation

## Overview
This document outlines the analytics tracking implementation using PostHog in ZonePal. It details the events being tracked, their properties, and the overall analytics strategy to measure user engagement and feature usage.

## Version
**Current Version:** 1.0.0 (March 1, 2024)

## Events Tracked

All events follow a consistent naming pattern: `category.action` to ensure clarity and organization in PostHog dashboards.

### Event Categories and Actions

The analytics system uses predefined categories and actions defined as enums:

```typescript
// Event categories
export enum EventCategory {
  TIMEZONE = 'timezone',
  BLOCKED_HOURS = 'blocked_hours',
  SETTINGS = 'settings',
  UI = 'ui',
}

// Event actions
export enum EventAction {
  ADD = 'add',
  REMOVE = 'remove',
  UPDATE = 'update',
  SORT = 'sort',
  TOGGLE = 'toggle',
  CHANGE = 'change',
  RESET = 'reset',
}
```

### Timezone Management Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `timezone.add` | User adds a new timezone | `timezone_id`, `timezone_name`, `total_count` |
| `timezone.remove` | User removes a timezone | `timezone_id`, `timezone_name`, `total_count` |
| `timezone.sort` | User sorts timezones | `sort_method` |
| `timezone.reset` | User resets to current time | - |

### Settings Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `settings.update` | User updates settings | `has_blocks`, `block_count` |
| `settings.toggle` | User toggles a setting | `setting_name`, `new_value` |

### Blocked Hours Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `blocked_hours.add` | User adds a blocked hour | `start_hour`, `end_hour` |
| `blocked_hours.remove` | User removes a blocked hour | `start_hour`, `end_hour` |
| `blocked_hours.update` | User updates blocked hours | `block_count` |

### UI Events

| Event Name | Description | Properties |
|------------|-------------|------------|
| `ui.change` | User interacts with UI elements | `element_type`, `element_id` |
| `ui.toggle` | User toggles UI components | `component_name`, `new_state` |

## Implementation Details

### Initialization

PostHog is initialized in the application and passed to the tracking function.

### Event Properties Interface

The analytics system uses a typed interface for event properties that supports various data types including strings, numbers, booleans, arrays, and nested objects.

### Tracking Function

The analytics module exports a helper function for tracking events that:

- Takes a PostHog instance, event category, event action, and optional properties
- Combines the category and action to form the event name (e.g., `timezone.add`)
- Automatically adds a timestamp to all events
- Logs events to the console in development mode
- Sends the event to PostHog if a valid instance is provided

### Usage in Components

Events are tracked in components by importing the tracking function and using the predefined enums. For example, when a user adds a timezone, the component would call the tracking function with the appropriate category, action, and properties such as timezone ID, name, and the total count of timezones.

### Development Mode Behavior

In development mode, the tracking function:
1. Logs the event and properties to the console with an `[Analytics]` prefix
2. Still sends the event to PostHog (if a valid instance is provided)

This allows for debugging and testing the analytics implementation during development.

### Automatic Properties

All events automatically include a `timestamp` property with the ISO string of when the event was triggered.

## Privacy Considerations

- No personally identifiable information (PII) is collected
- IP addresses are anonymized
- Users can opt-out via browser settings (Do Not Track)
- Cookie consent is implemented for EU users

## Success Metrics

The following metrics are used to measure success:

1. **User Engagement**
   - Daily/weekly active users
   - Average session duration
   - Number of timezones added per user

2. **Feature Usage**
   - Percentage of users using blocked hours
   - Most popular timezones
   - Usage patterns across different UI components

3. **Retention**
   - 7-day retention rate
   - 30-day retention rate
   - Return visitor frequency

## Changelog

### Version 1.0.0 (March 1, 2024)
- Initial implementation of PostHog analytics
- Added tracking for timezone management events
- Added tracking for settings events
- Added tracking for UI interactions
- Added tracking for blocked hours management
- Documentation updated to match actual implementation
- Added details about automatic timestamp property
- Clarified development mode behavior

### Version 0.1.0 (February 15, 2024)
- Analytics planning and strategy development
- PostHog integration setup
- Test events implementation