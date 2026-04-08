#include <stdio.h>
enum states {S_start, s_in_id, S_Acc_ID, } ;
enum tokens {TOKEN_ID, TOKEN_ASSIGN, TOKEN_LESS, TOKEN_LESSEQUAL, TOKEN_EQUAL, /* other tokens */};

int DFA() {
    enum states curr_state = S_start;
    char curr_char;
    int input_idx = 0;
    char lexeme[100]; // Buffer to hold the current lexeme
    int lexeme_idx = 0; // Index for the lexeme buffer

    switch(curr_state) {
        case S_start: if (isalpha(curr_char)) {
            curr_state = s_in_id;
            input_idx++;
            lexeme[lexeme_idx++] = curr_char;
            } else if (curr_char == ':') {
                curr_state = S_in_assign;
                lexeme[lexeme_idx++] = curr_char;
                input_idx++;
            } else if (curr_char == '<') {
                curr_state = S_less;
                lexeme[lexeme_idx++] = curr_char;
                input_idx++;
            } else if (curr_char == '=') {
                curr_state = S_Acc_equal;
                lexeme[lexeme_idx++] = curr_char;
                input_idx++;
            }        
            break;
        case s_in_id: if (isalpha(curr_char) || isdigit(curr_char)) {
                input_idx++;
                lexeme[lexeme_idx++] = curr_char;
            } else {
                curr_state = S_Acc_ID;
            }
            break;
        case S_in_assign: if (curr_char == '=') {
                curr_state = S_Acc_assign;
                lexeme[lexeme_idx++] = curr_char;
                input_idx++;
            } else curr_state = S_Error;
            break;
        case S_less: if (curr_char == '=') {
                curr_state = S_Acc_lessequal;
                lexeme[lexeme_idx++] = curr_char;
                input_idx++;
            } else {
                curr_state = S_Acc_less;
            break;

        // other states and transitions
        case S_Acc_ID: 
                lexeme[lexeme_idx] = '\0'; // Null-terminate the lexeme
                keyword_number = check_keyword(lexeme);
                if (keyword_number != -1) {
                    token_number = keyword_number; // Token is a keyword
                } else {
                    token.number = TOKEN_ID; // Token is an identifier
                    token.value = insertSymboleTable(lexeme); // Insert into symbol table and get value
                }
                lexeme_idx = 0; // Reset lexeme index for next token
                curr_state = S_start; // Reset state for next token
                break;
        case S_Acc_assign:
                lexeme[lexeme_idx] = '\0'; // Null-terminate the lexeme
                token.number = TOKEN_ASSIGN; // Token is an assignment operator
                lexeme_idx = 0; // Reset lexeme index for next token
                curr_state = S_start; // Reset state for next token
                break;
        case S_Acc_lessequal:
                lexeme[lexeme_idx] = '\0'; // Null-terminate the lexeme
                token.number = TOKEN_LESSEQUAL; // Token is a less than or equal operator
                lexeme_idx = 0; // Reset lexeme index for next token
                curr_state = S_start; // Reset state for next token
                break;
        case S_Acc_less:
                lexeme[lexeme_idx] = '\0'; // Null-terminate the lexeme
                token.number = TOKEN_LESS; // Token is a less than operator
                lexeme_idx = 0; // Reset lexeme index for next token
                curr_state = S_start; // Reset state for next token
                break;
        case S_Acc_equal:
                lexeme[lexeme_idx] = '\0'; // Null-terminate the lexeme
                token.number = TOKEN_EQUAL; // Token is an equality operator
                lexeme_idx = 0; // Reset lexeme index for next token
                curr_state = S_start; // Reset state for next token
                break;
        case S_Acc_semicolon:
                makeToken(TOKEN_SEMICOLON); // Create a token for semicolon
                break;
    }
}

void makeToken(enum aToken)
{
    lexeme[lexeme_idx] = '\0'; // Null-terminate the lexeme
    token.number = aToken; // Token is a semicolon
    lexeme_idx = 0; // Reset lexeme index for next token
    curr_state = S_start; // Reset state for next token
    // printf("(%d, %d)\n", token.number, token.value); // Print the token
}