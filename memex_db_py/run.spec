# -*- mode: python ; coding: utf-8 -*-

from PyInstaller.utils.hooks import collect_data_files

block_cipher = None

a = Analysis(
    ['run.py'],
    pathex=[],
    binaries=[],
    datas=[('config.json', './chroma')] + collect_data_files('chromadb', include_py_files=True, includes=['**/*.py', '**/*.sql']),
    hiddenimports=[
        'flask', 
        'chromadb',
        'tqdm',
        'chromadb.migrations',
        'chromadb.migrations.embeddings_queue',
        'chromadb.telemetry.product.posthog',
        'chromadb.api.segment',
        'chromadb.db.impl',
        'chromadb.db.impl.sqlite',
        'importlib-resources',
        'hnswlib'
    ],
    hookspath=['./build-hooks'],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='memex_db',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
