export const GetCurrentUser = `
query { 
    me 
    { 
        id 
    }
}`;

export const GetAssignedItems = `
query($boardId: [ID!]) {
    boards(ids: $boardId) {
    items_page(
        query_params: {
        rules: [
            {
                column_id: "person"
                compare_value: ["assigned_to_me"]
                operator: any_of
            }
        ]
        }
    ) {
        items {
            id
            name
            board {
                id
                name
            }
            column_values {
                id
                text
                type
                value
            }
        }
    }
    }
}`;

export const GetItemData = `
query getItem($itemId: [ID!]) {
    items(ids: $itemId) {
        id
        name
        board {
            id
            name
        }
        column_values {
            id
            text
          	value
        }
    }
}`;

export const GetUnassignedItems = `
query($boardId: [ID!]) {
    boards(ids: $boardId) {
    items_page(
        query_params: {
        rules: [
            {
                column_id: "person"
                compare_value: []
                operator: is_empty
            }
        ]
        }
    ) {
        items {
            id
            name
        }
    }
    }
}`;

export const ChangeStatus = `
mutation($boardId: ID!, $itemId: ID!, $newStatus: String!) {
    change_simple_column_value(
        board_id: $boardId
        item_id: $itemId
        column_id: "status"
        value: $newStatus
    ) { 
        id 
    }
}`;

export const AssignItemToUser = `
mutation($boardId: ID!, $itemId: ID!, $userId: String!) {
  change_simple_column_value(
    item_id: $itemId
    board_id: $boardId
    column_id: "person"
    value: $userId
  ) {
    id
  }
}`;

export const ChangeColumnValue = `
mutation($boardId: ID!, $itemId: ID!, $columnId: String!, $newValue: String!) {
  change_simple_column_value(
    item_id: $itemId
    board_id: $boardId
    column_id: $columnId
    value: $newValue
  ) {
    id
  }
}
`;

export const CompleteItem = `
mutation($boardId: ID!, $itemId: ID!, $newStatus: String!, $notesColumn: String!, $notesValue: String!) {
  change_multiple_column_values(
    item_id: $itemId
    board_id: $boardId
    column_values: "{\"status\": {\"label\": $newStatus }, $notesColumn: $notesValue }"
  ) {
    id
  }
}
`;
