import sys
import subprocess
import time
with open('out') as file:
    while True:
        try:
            cmd = input('server > ')
            prev = file.read()
            subprocess.run(['bash', 'execute.sh', cmd])
            after = file.read()
            print(after)
            print(after.replace(prev, ""))
        except KeyboardInterrupt:
            print('\n')
            sys.exit(0)
        except Exception:
            sys.exit(1)
        time.sleep(1)
