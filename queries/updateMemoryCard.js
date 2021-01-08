const updateMemoryCard = `
UPDATE
    memory_cards
SET
    total_successful_attempts = ?
WHERE
    id = ?;
`;
module.exports = updateMemoryCard;
