const selectQueue = `
    SELECT
        *
    FROM
        memory_cards
    WHERE
        memory_cards.user_id = ?
    ORDER BY
        memory_cards.lastAttempt_at ASC
    LIMIT 2;
    `;
module.exports = selectQueue;
