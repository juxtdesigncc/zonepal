# Timezone Search Functionality PRD

## Overview
This document outlines the search functionality for the timezone selector, including search terms, ranking priorities, expected behaviors, and the recent timezones feature.

## Search Results Display Order

### Tier 0: Recent Timezones (Highest Priority)
- Previously used timezones that are not currently active
- Displayed at the top of search results in a separate "Recent" section
- Sorted by most recently used first
- Limited to 5 most recent timezones
- Persisted in localStorage
- Automatically includes timezones added via URL parameters

### Tier 1: Exact Matches
1. Exact country name match (e.g., "China" → all cities in China)
2. Exact country code match (e.g., "CN" → all cities in China)
3. Exact city name match (e.g., "Hong Kong" → Asia/Hong_Kong)
4. Exact IANA timezone identifier (e.g., "Asia/Shanghai")

### Tier 2: Country-Based Searches
1. Partial country name matches (e.g., "United" → United States, United Kingdom)
2. Country name within compound searches (e.g., "London United" → London, United Kingdom)
3. Country code within compound searches (e.g., "US New" → New York, New Orleans)

### Tier 3: City and Region Searches
1. Partial city name matches (e.g., "New" → New York, New Delhi)
2. Region matches (e.g., "Asia" → all Asian cities)
3. Common city name variations (e.g., "NYC" → New York)

### Tier 4: Technical Identifiers
1. Timezone offset (e.g., "GMT+8" → all cities in that timezone)
2. Region part of IANA identifier (e.g., "America/" → all American timezones)

## Search Behavior

### Compound Search Terms
- Multiple word searches should match across different fields
- Words can match in any order (e.g., "York New" = "New York")
- Spaces at start/end should be trimmed
- Multiple spaces between words should be normalized

### Special Cases
1. Partial Word Matches
   - Should work with partial city names (e.g., "New" → New York, New Delhi)
   - Should work with partial country names (e.g., "Unit" → United States)

2. Country-Specific Behavior
   - When exact country match is found, group all results under country name
   - Show all cities within matched country
   - Sort cities alphabetically within country group

3. Mixed Search Scenarios
   - Country + City (e.g., "London UK")
   - Region + City (e.g., "Asia Tokyo")
   - City + Offset (e.g., "Paris GMT+1")

## Result Grouping

### Recent Timezones Grouping
- Recent timezones are always displayed at the top in their own group
- Separated from search results with a visual divider
- Only shows timezones that are not currently active in the main display
- Sorted by most recently used first

### Country Match Grouping
- When search matches a country:
  1. Group all results under country name
  2. Sort cities alphabetically
  3. Show timezone offset for each city

### Region-Based Grouping
- When search doesn't match a specific country:
  1. Group by geographical region
  2. Sort countries alphabetically within region
  3. Sort cities alphabetically within country

## Display Format

### Recent Timezones
- City name (primary text)
- Country name and code (secondary text)
- Timezone offset (right-aligned)
- Visual separator between recent timezones and search results

### Search Results
- City name (primary text)
- Country name and code (secondary text)
- Timezone offset (right-aligned)
- Visual indication for already selected timezones (disabled state)

### Additional Information
- Show DST information when applicable
- Display full IANA timezone identifier
- Include GMT/UTC offset

## Recent Timezones Implementation

### Storage
- Uses localStorage with key 'zonepal_recent_timezones'
- Stores an array of IANA timezone identifiers
- Limited to 5 most recent timezones
- Most recently used timezone is always at the front of the array

### Adding to Recent Timezones
- When a timezone is selected from search
- When timezones are loaded from URL parameters
- Existing entries are moved to the front when reused
- Duplicates are removed

### Filtering Logic
- Recent timezones that are already active in the main display are filtered out
- This ensures users only see options they can actually add
- The filtering happens dynamically when the search dropdown opens

### Keyboard Interaction
- Pressing 'K' anywhere in the application opens the search
- Arrow keys can navigate through recent timezones and search results
- Enter selects the currently highlighted timezone

## Testing Scenarios

### Recent Timezones
- Adding a timezone should add it to recent list
- Removing a timezone should not remove it from recent list
- Loading timezones from URL should add them to recent list
- Recent list should be limited to 5 items
- Recent list should only show timezones not currently active

### Country Searches
- Full country name ("United States")
- Country code ("US")
- Partial country name ("United")

### City Searches
- Full city name ("New York")
- Partial city name ("New")
- City with spaces ("Los Angeles")

### Mixed Searches
- City and country ("London United Kingdom")
- Region and city ("Asia Tokyo")
- Multiple words ("New York United States")

## Search Algorithm Implementation

### Search Process
1. Check for empty search - return all timezones
2. Clean and normalize search terms
3. Try exact matches first
4. If no exact matches, try partial matches where all terms are included
5. If still no matches, try broader matches where any term matches
6. Group and sort results based on match type
7. Apply recent timezones at the top of results

### Performance Considerations
- Memoize search results to prevent unnecessary recalculations
- Use efficient filtering algorithms for large timezone datasets
- Implement debouncing for search input to prevent excessive processing
- Optimize component rendering with React.memo for list items 