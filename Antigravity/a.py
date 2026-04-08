def calculate_mean_and_variance(numbers):
    """
    정수 리스트를 입력받아 평균과 분산을 계산하는 함수
    """
    # 1. 입력값이 리스트인지 확인
    if not isinstance(numbers, list):
        raise TypeError("입력값은 리스트 형태여야 합니다.")
        
    # 2. 리스트가 비어있는지 확인
    if len(numbers) == 0:
        raise ValueError("입력 리스트가 비어 있습니다. 최소 1개 이상의 요소가 필요합니다.")
        
    # 3. 리스트의 모든 요소가 정수(또는 실수)인지 확인
    for num in numbers:
        if not isinstance(num, (int, float)):
            raise TypeError(f"리스트에 숫자가 아닌 값이 포함되어 있습니다: {num}")

    # 요소의 개수
    n = len(numbers)
    
    # 평균 계산
    mean = sum(numbers) / n
    
    # 분산 계산 (모분산 기준: n으로 나눔)
    # 표본분산을 구하려면 n-1로 나누면 됩니다.
    variance = sum((x - mean) ** 2 for x in numbers) / n
    
    return mean, variance

if __name__ == "__main__":
    test_cases = [
        [1, 2, 3, 4, 5],          # 정상적인 리스트
        [],                       # 빈 리스트 (ValueError 발생 예상)
        [1, 2, 'a', 4],           # 문자열 포함 (TypeError 발생 예상)
        "이건 리스트가 아님",     # 리스트 아님 (TypeError 발생 예상)
    ]

    for i, test_data in enumerate(test_cases, 1):
        print(f"\n테스트 케이스 {i}: {test_data}")
        try:
            mean_val, var_val = calculate_mean_and_variance(test_data)
            print(f"-> 평균: {mean_val:.2f}, 분산: {var_val:.2f}")
        except ValueError as ve:
            print(f"-> [ValueError 발생] {ve}")
        except TypeError as te:
            print(f"-> [TypeError 발생] {te}")
        except Exception as e:
            print(f"-> [예상치 못한 오류 발생] {e}")
