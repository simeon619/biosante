import os
import pty
import sys
import select
import time
import re

def run_ssh(command):
    host = "root@92.112.193.206"
    password = "2HSctD8ErA#NpoGFm(1R"
    ssh_cmd = ["ssh", "-o", "StrictHostKeyChecking=no", host, command]
    pid, fd = pty.fork()
    if pid == 0:
        os.execvp("ssh", ssh_cmd)
    else:
        output = b""
        password_sent = False
        try:
            while True:
                r, w, e = select.select([fd], [], [], 300)
                if not r: break
                data = os.read(fd, 4096)
                if not data: break
                output += data
                sys.stdout.buffer.write(data)
                sys.stdout.buffer.flush()
                
                if not password_sent and re.search(b"[Pp]assword:", output):
                    time.sleep(0.5)
                    os.write(fd, (password + "\n").encode())
                    password_sent = True
        except OSError: pass
        finally:
            os.close(fd)
            os.waitpid(pid, 0)

if __name__ == "__main__":
    run_ssh(sys.argv[1])
