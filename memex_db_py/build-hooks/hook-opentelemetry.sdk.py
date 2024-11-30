from PyInstaller.utils.hooks import copy_metadata
datas = copy_metadata("opentelemetry_sdk", recursive=True)