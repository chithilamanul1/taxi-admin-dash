import re

def trace_divs(content):
    lines = content.split('\n')
    stack = []
    for i, line in enumerate(lines):
        # Find all <div or </div>
        tokens = re.findall(r'<(div|/div)\b', line)
        for token in tokens:
            if token == 'div':
                stack.append(i + 1)
            else:
                if stack:
                    stack.pop()
                else:
                    print(f"Extra </div> at line {i + 1}")
    
    if stack:
        print(f"Unclosed <div> at lines: {stack}")
    else:
        print("All divs balanced!")

with open('src/components/BookingModal.jsx', 'r', encoding='utf-8') as f:
    trace_divs(f.read())
