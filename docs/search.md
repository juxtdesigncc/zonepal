# Timezone Search Functionality PRD

## Overview
This document outlines the search functionality for the timezone selector, including search terms, ranking priorities, and expected behaviors.

## Search Terms Priority

### Tier 1: Exact Matches (Highest Priority)
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

### Search Results
- City name (primary text)
- Country name and code (secondary text)
- Timezone offset (right-aligned)

### Additional Information
- Show DST information when applicable
- Display full IANA timezone identifier
- Include GMT/UTC offset

## Testing Scenarios

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