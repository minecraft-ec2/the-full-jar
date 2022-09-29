import sys
import subprocess
import time

while True:
    try:
        cmd = input('server > ')
        subprocess.run(['bash', 'execute.sh', cmd])
    except KeyboardInterrupt:
        print('\n')
        sys.exit(0)
    except Exception:
        sys.exit(1)
    time.sleep(1)
