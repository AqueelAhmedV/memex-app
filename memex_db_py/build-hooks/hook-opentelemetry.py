from PyInstaller.utils.hooks import collect_submodules, copy_metadata
hiddenimports = collect_submodules('opentelemetry')
datas = copy_metadata("opentelemetry_api", recursive=True)