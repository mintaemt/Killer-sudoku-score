#!/usr/bin/env python3
"""
Script to fix translation issues in useLanguage.ts
1. Fix Korean footer structure (add proper footer links and separate about section)
2. Add disclaimer and limitationOfLiability keys to all languages
"""

import re

def fix_translations(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix 1: Korean footer structure
    # Find and replace the Korean footer section
    korean_footer_pattern = r"(    // Footer Legal Links\r?\n    footer: \{\r?\n)(      seoTitle: '킬러 스도쿠 소개[^}]+\},\r?\n    \},)"
    
    korean_footer_replacement = r"\1      about: '소개',\r\n      howToPlay: '게임 방법',\r\n      strategy: '전략',\r\n      terms: '서비스 이용약관',\r\n      privacy: '개인정보처리방침',\r\n      cookies: '쿠키',\r\n      contact: '문의하기',\r\n    },\r\n\r\n    // Content Pages\r\n    about: {\r\n\2"
    
    content = re.sub(korean_footer_pattern, korean_footer_replacement, content, flags=re.DOTALL)
    
    # Fix 2: Add disclaimer and limitationOfLiability to English
    en_terms_pattern = r"(        serviceAvailability: 'Service Availability',\r?\n        serviceAvailabilityContent: 'We strive to maintain[^']+\.',\r?\n)        liability: 'Limitation of Liability',\r?\n        liabilityContent: 'To the maximum extent[^']+\.',\r?\n(        termination: 'Termination',)"
    
    en_terms_replacement = r"\1        disclaimer: 'Disclaimer',\r\n        disclaimerContent: 'The service is provided \"as is\" without warranties of any kind. We do not guarantee accuracy, reliability, or availability of the service.',\r\n        limitationOfLiability: 'Limitation of Liability',\r\n        limitationOfLiabilityContent: 'To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.',\r\n\2"
    
    content = re.sub(en_terms_pattern, en_terms_replacement, content, flags=re.DOTALL)
    
    # Fix 3: Add disclaimer and limitationOfLiability to Chinese
    zh_terms_pattern = r"(        serviceAvailability: '服務可用性',\r?\n        serviceAvailabilityContent: '我們努力維持[^']+\.',\r?\n)        liability: '責任限制',\r?\n        liabilityContent: '在法律允許的最大範圍內[^']+\.',\r?\n(        termination: '終止',)"
    
    zh_terms_replacement = r"\1        disclaimer: '免責聲明',\r\n        disclaimerContent: '服務按「現狀」提供，不提供任何形式的保證。我們不保證服務的準確性、可靠性或可用性。',\r\n        limitationOfLiability: '責任限制',\r\n        limitationOfLiabilityContent: '在法律允許的最大範圍內，我們不對因使用服務而產生的任何間接、附帶、特殊、後果性或懲罰性損害負責。',\r\n\2"
    
    content = re.sub(zh_terms_pattern, zh_terms_replacement, content, flags=re.DOTALL)
    
    # Fix 4: Add disclaimer and limitationOfLiability to Korean
    ko_terms_pattern = r"(        serviceAvailability: '서비스 가용성',\r?\n        serviceAvailabilityContent: '저희는 서비스 가용성을[^']+\.',\r?\n)        liability: '책임 제한',\r?\n        liabilityContent: '법률이 허용하는 최대 범위[^']+\.',\r?\n(        termination: '계약 해지',)"
    
    ko_terms_replacement = r"\1        disclaimer: '면책 조항',\r\n        disclaimerContent: '서비스는 어떠한 종류의 보증 없이 \"있는 그대로\" 제공됩니다. 저희는 서비스의 정확성, 신뢰성 또는 가용성을 보장하지 않습니다.',\r\n        limitationOfLiability: '책임 제한',\r\n        limitationOfLiabilityContent: '법률이 허용하는 최대 범위 내에서 저희는 서비스 사용으로 인해 발생하는 간접적, 부수적, 특별, 결과적 또는 징벌적 손해에 대해 책임지지 않습니다.',\r\n\2"
    
    content = re.sub(ko_terms_pattern, ko_terms_replacement, content, flags=re.DOTALL)
    
    # Fix 5: Add disclaimer and limitationOfLiability to Japanese
    ja_terms_pattern = r"(        serviceAvailability: 'サービスの可用性',\r?\n        serviceAvailabilityContent: '当社はサービスの可用性を[^']+\.',\r?\n)        liability: '責任の制限',\r?\n        liabilityContent: '法律で許可される最大限の範囲で[^']+\.',\r?\n(        termination: '契約終了',)"
    
    ja_terms_replacement = r"\1        disclaimer: '免責事項',\r\n        disclaimerContent: 'サービスはいかなる種類の保証もなく「現状のまま」提供されます。当社はサービスの正確性、信頼性、または可用性を保証しません。',\r\n        limitationOfLiability: '責任の制限',\r\n        limitationOfLiabilityContent: '法律で許可される最大限の範囲で、当社はサービスの使用から生じる間接的、付随的、特別、結果的、または懲罰的損害について責任を負いません。',\r\n\2"
    
    content = re.sub(ja_terms_pattern, ja_terms_replacement, content, flags=re.DOTALL)
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Translation fixes applied successfully!")
    return True

if __name__ == "__main__":
    file_path = r"c:\Users\soomin\.gemini\antigravity\scratch\新增資料夾\Killer-sudoku-score\src\hooks\useLanguage.ts"
    fix_translations(file_path)
