#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 동적 메모리를 사용하여 문자열을 역순으로 만들고 반환하는 함수
char* create_reversed_string(const char* str) {
    if (str == NULL) return NULL;

    int len = strlen(str);
    
    // 역순 문자열을 담을 메모리 동적 할당 (널 종료 문자 '\0' 포함)
    char* reversed = (char*)malloc(sizeof(char) * (len + 1));
    
    if (reversed == NULL) {
        printf("메모리 할당에 실패했습니다.\n");
        return NULL; // 할당 실패 시 NULL 반환
    }

    // 뒤에서부터 순서대로 문자를 복사
    for (int i = 0; i < len; i++) {
        reversed[i] = str[len - 1 - i];
    }
    
    // 문자열의 끝을 알리는 널 문자 추가
    reversed[len] = '\0';

    return reversed;
}

int main() {
    char buffer[256];

    printf("input string: ");
    if (fgets(buffer, sizeof(buffer), stdin) != NULL) {
        // fgets 사용 시 끝에 들어갈 수 있는 개행 문자('\n') 제거
        buffer[strcspn(buffer, "\n")] = '\0';

        // 역순 문자열 생성 (동적 할당됨)
        char* reversed_str = create_reversed_string(buffer);

        if (reversed_str != NULL) {
            // 결과 출력
            printf("original string: %s\n", buffer);
            printf("reversed string: %s\n", reversed_str);

            // 중요: 동적 할당된 메모리는 사용이 끝난 후 반드시 해제해주어야 합니다 (메모리 누수 방지).
            free(reversed_str);
        }
    }

    return 0;
}
