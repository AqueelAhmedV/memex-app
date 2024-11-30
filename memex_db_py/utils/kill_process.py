import psutil

def find_and_kill_process_by_port(port):
    """Find and terminate process listening on given port."""
    def find_process_by_port(port):
        """Find and return process listening on given port."""
        for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
            try:
                connections = proc.connections()
                for conn in connections:
                    if conn.laddr.port == port:
                        return proc
            except psutil.AccessDenied:
                pass
            except psutil.NoSuchProcess:
                pass
        return None

    def kill_process(process):
        """Terminate the given process."""
        if process:
            print(f"Terminating process {process.pid}: {process.name()} - {process.cmdline()}")
            process.terminate()

    process = find_process_by_port(port)
    if process:
        kill_process(process)
    else:
        print(f"No process found running on port {port}")