#!/usr/bin/env python3
"""
Quick diagnostic script for FastAPI + React project
Checks for common issues before starting services
"""

import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    print(f"✓ Python {version.major}.{version.minor}.{version.micro}")
    return version >= (3, 9)

def check_venv():
    """Check if in virtual environment"""
    in_venv = hasattr(sys, 'real_prefix') or (
        hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix
    )
    if in_venv:
        print(f"✓ Virtual environment active: {sys.prefix}")
    else:
        print("⚠ Not in virtual environment - activate venv before running")
    return in_venv

def check_packages():
    """Check required packages"""
    packages = {
        'fastapi': 'FastAPI',
        'uvicorn': 'Uvicorn',
        'sqlalchemy': 'SQLAlchemy',
        'pydantic': 'Pydantic',
    }
    
    all_present = True
    for module, name in packages.items():
        try:
            __import__(module)
            print(f"✓ {name} installed")
        except ImportError:
            print(f"✗ {name} NOT installed")
            all_present = False
    return all_present

def check_database():
    """Check database connectivity"""
    try:
        import psycopg2
        try:
            conn = psycopg2.connect(
                "dbname=postgres user=postgres password=password host=localhost"
            )
            print("✓ PostgreSQL connection successful")
            conn.close()
            return True
        except Exception as e:
            print(f"✗ PostgreSQL connection failed: {e}")
            print("  → Ensure PostgreSQL is running on localhost:5432")
            print("  → Verify credentials: user=postgres, password=password")
            return False
    except ImportError:
        print("✗ psycopg2 not installed")
        return False

def check_database_exists():
    """Check if Student_db database exists"""
    try:
        import psycopg2
        conn = psycopg2.connect(
            "dbname=Student_db user=postgres password=password host=localhost"
        )
        print("✓ Database 'Student_db' exists")
        conn.close()
        return True
    except Exception as e:
        print(f"✗ Database 'Student_db' not found")
        print("  → Run: CREATE DATABASE Student_db;")
        return False

def check_npm():
    """Check if npm is installed"""
    try:
        result = subprocess.run(
            ['npm', '--version'],
            capture_output=True,
            text=True,
            timeout=5
        )
        if result.returncode == 0:
            print(f"✓ npm {result.stdout.strip()} installed")
            return True
    except:
        pass
    print("✗ npm not installed")
    return False

def check_node_modules():
    """Check if node_modules exists"""
    node_modules = Path("frontend/talentspark/node_modules")
    if node_modules.exists():
        print("✓ Frontend dependencies installed")
        return True
    else:
        print("⚠ Frontend dependencies not installed")
        print("  → Run: cd frontend/talentspark && npm install")
        return False

def main():
    print("=" * 50)
    print("FastAPI + React Project Diagnostics")
    print("=" * 50)
    print()
    
    checks = [
        ("Python Version", check_python_version),
        ("Virtual Environment", check_venv),
        ("Python Packages", check_packages),
        ("PostgreSQL Connection", check_database),
        ("Student_db Database", check_database_exists),
        ("npm", check_npm),
        ("Node Modules", check_node_modules),
    ]
    
    results = []
    for name, check in checks:
        print(f"\n{name}:")
        try:
            result = check()
            results.append((name, result))
        except Exception as e:
            print(f"  Error: {e}")
            results.append((name, False))
    
    print()
    print("=" * 50)
    print("Summary:")
    print("=" * 50)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✓" if result else "✗"
        print(f"{status} {name}")
    
    print()
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("\n✨ All checks passed! Ready to start services.")
        print("\nStart commands:")
        print("  Backend:  .\\env\\Scripts\\python.exe -m uvicorn app.main:app --reload")
        print("  Frontend: npm run dev")
    else:
        print("\n⚠ Some checks failed. See above for details.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
