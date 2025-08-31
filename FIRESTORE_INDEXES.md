# Firestore Indexes for Proposal System

To support the proposal system, we need to create the following index in Firestore:

```
Collection: proposals
Fields to index:
1. projectId (Ascending)
2. freelancerId (Ascending)
```

## How to Create the Index

1. Go to your Firebase Console
2. Select your project
3. Navigate to Firestore Database
4. Click on the "Indexes" tab
5. Click "Create Index"
6. Set the collection ID to "proposals"
7. Add these fields:
   - projectId (Ascending)
   - freelancerId (Ascending)
8. Set the query scope to "Collection"
9. Click "Create"

This index is required to support the query that checks if a freelancer has already submitted a proposal for a specific project.

## Additional Recommended Indexes

For better performance with complex queries, consider adding these indexes as well:

```
Collection: proposals
Fields to index:
1. projectId (Ascending)
2. status (Ascending)
3. submittedAt (Descending)
```

This will help optimize queries that search for all proposals for a project sorted by submission date.

```
Collection: proposals
Fields to index:
1. freelancerId (Ascending)
2. status (Ascending)
3. submittedAt (Descending)
```

This will help optimize queries that search for all proposals by a freelancer sorted by submission date.
