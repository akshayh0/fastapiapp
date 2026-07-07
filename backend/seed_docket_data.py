import sys
import os

# Adjust import path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models.company import Company
from models.job import Job
from services.qdrant_service import COLLECTION_NAME, qdrant, embed_all_jobs

def seed():
    db = SessionLocal()
    try:
        print("Clearing existing jobs and companies in PostgreSQL...")
        db.query(Job).delete()
        db.query(Company).delete()
        db.commit()
        print("Existing PostgreSQL records cleared.")

        # Define 10 sample companies
        companies_data = [
            {"name": "Quantum Aerospace", "email": "quantum@aerospace.io", "phone": "+1-555-0101", "location": "Seattle, WA"},
            {"name": "Ethereal Systems", "email": "info@ethereal.sys", "phone": "+1-555-0102", "location": "San Francisco, CA"},
            {"name": "Vertex Cybernetics", "email": "contact@vertex.cy", "phone": "+1-555-0103", "location": "Boston, MA"},
            {"name": "Obsidian Ledger", "email": "contact@obsidian.ledger", "phone": "+1-555-0104", "location": "New York, NY"},
            {"name": "Zenith Robotics", "email": "zenith@robotics.ai", "phone": "+1-555-0105", "location": "Austin, TX"},
            {"name": "Chronos Capital", "email": "desk@chronos.cap", "phone": "+1-555-0106", "location": "Chicago, IL"},
            {"name": "Apex Diagnostics", "email": "labs@apex.diag", "phone": "+1-555-0107", "location": "San Diego, CA"},
            {"name": "Vector Engines", "email": "vector@engines.co", "phone": "+1-555-0108", "location": "Denver, CO"},
            {"name": "Forge Materials", "email": "forge@materials.org", "phone": "+1-555-0109", "location": "Pittsburgh, PA"},
            {"name": "Spectra Media", "email": "press@spectra.media", "phone": "+1-555-0110", "location": "Atlanta, GA"},
        ]

        companies = []
        for c_data in companies_data:
            company = Company(
                name=c_data["name"],
                email=c_data["email"],
                phone=c_data["phone"],
                location=c_data["location"]
            )
            db.add(company)
            companies.append(company)
        
        db.flush() # Populate company IDs before inserting jobs

        # Define 10 sample jobs linked to companies
        jobs_data = [
            {
                "title": "Principal Guidance Systems Engineer",
                "description": "Develop and calibrate autopilot feedback controllers, orbital maneuvering pipelines, and telemetry parsing logic for weightless transport vehicles.",
                "salary": 185000,
                "company_id": companies[0].id
            },
            {
                "title": "Senior Distributed Systems Engineer",
                "description": "Build high-throughput actor framework pipelines in Rust. Design custom consensus configurations and low-latency storage engines.",
                "salary": 170000,
                "company_id": companies[1].id
            },
            {
                "title": "Machine Learning Security Specialist",
                "description": "Design adversarial defenses and boundary integrity checkers for production LLMs. Experience with model inversion attacks is required.",
                "salary": 160000,
                "company_id": companies[2].id
            },
            {
                "title": "Cryptographic Protocol Researcher",
                "description": "Design zero-knowledge verification proofs and privacy-preserving multi-party compute state-machines for modern ledger networks.",
                "salary": 195000,
                "company_id": companies[3].id
            },
            {
                "title": "Robotics Control Software Engineer",
                "description": "Program real-time C++ trajectory controllers and forward kinematics layers for highly articulated remote-sensing hardware limbs.",
                "salary": 150000,
                "company_id": companies[4].id
            },
            {
                "title": "High-Frequency Trading C++ Developer",
                "description": "Optimize ultra-low latency execution pipelines. Tune kernel network stacks, direct memory mapping APIs, and FPGA accelerators.",
                "salary": 210000,
                "company_id": companies[5].id
            },
            {
                "title": "Bio-Informatics Systems Architect",
                "description": "Design parallel sequence alignment processors and genomic feature mapping tools for high-density diagnostic hardware grids.",
                "salary": 145000,
                "company_id": companies[6].id
            },
            {
                "title": "Senior Optimization Compiler Engineer",
                "description": "Optimize compiler passes and code-generation backends for custom GPU architectures. Build SIMD auto-vectorizer pipelines.",
                "salary": 180000,
                "company_id": companies[7].id
            },
            {
                "title": "Metallurgy Process Automation Engineer",
                "description": "Design and calibrate closed-loop PLC logic control programs for automated metal extrusion and forging equipment.",
                "salary": 135000,
                "company_id": companies[8].id
            },
            {
                "title": "Rendering Pipeline Technical Director",
                "description": "Engineer low-overhead Vulkan graphics pipelines, real-time lighting solutions, and asset compilers for high-fidelity virtual simulations.",
                "salary": 155000,
                "company_id": companies[9].id
            }
        ]

        for j_data in jobs_data:
            job = Job(
                title=j_data["title"],
                description=j_data["description"],
                salary=j_data["salary"],
                company_id=j_data["company_id"]
            )
            db.add(job)

        db.commit()
        print("Successfully seeded 10 companies and 10 job openings in PostgreSQL.")

        # Clear and sync Qdrant vector index
        print("Recreating Qdrant vector collection to clear stale listings...")
        try:
            qdrant.delete_collection(COLLECTION_NAME)
        except Exception as q_err:
            print(f"Note (Qdrant delete): {q_err}")

        print("Embedding new jobs into Qdrant index...")
        num_embedded = embed_all_jobs(db)
        print(f"Successfully embedded {num_embedded} jobs in Qdrant search index.")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
