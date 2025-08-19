# Enhanced policy generator with Supabase integration
# Generates sample homeowners insurance policies and stores them in Supabase
import os, random, json, textwrap
from datetime import date, timedelta
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
from zipfile import ZipFile, ZIP_DEFLATED
from supabase import create_client, Client
from typing import Dict, List, Any
import io

# Supabase configuration
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://tbqneigukeehyvhvaddw.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY', '')  # You'll need to set this

# Initialize Supabase client
def init_supabase() -> Client:
    if not SUPABASE_KEY:
        raise ValueError("SUPABASE_ANON_KEY environment variable is required")
    return create_client(SUPABASE_URL, SUPABASE_KEY)

random.seed(21); np.random.seed(21)

out_root = "ho_dataset_fast"
pdf_dir = os.path.join(out_root, "pdf")
os.makedirs(pdf_dir, exist_ok=True)

states = [{"code":"TN","name":"Tennessee"},{"code":"TX","name":"Texas"},{"code":"CA","name":"California"}]
carriers = ["Summit Home & Casualty","Centurion Mutual","Liberty Lakes Insurance"]
state_cities = {
    "TN": ["Nashville","Knoxville","Chattanooga","Memphis","Franklin","Murfreesboro"],
    "TX": ["Austin","Dallas","Houston","San Antonio","Plano","Frisco"],
    "CA": ["Los Angeles","San Diego","San Jose","Sacramento","Irvine","Fresno"]
}
state_zips = {
    "TN": ["37211","37209","37064","37902","38117","37408"],
    "TX": ["78701","75201","77002","78205","75024","75034"],
    "CA": ["90012","92101","95113","95814","92618","93721"]
}
streets = ["Maple St","Oak Ave","Pine Rd","Cedar Ln","Birch Dr","Willow Way","Elm St","Spruce Ct","Hickory Blvd","Walnut Pl"]
roof_types = ["Asphalt","Metal","Tile","Slate","Wood"]
construction_types = ["Frame","Brick","Stucco","Concrete","Modular"]
occupancy_types = ["Owner-Occupied","Tenant-Occupied","Seasonal"]
first_names = ["Alex","Taylor","Jordan","Casey","Riley","Morgan","Avery","Parker","Jamie","Drew","Sam","Cameron","Reese","Quinn","Logan","Rowan","Elliot","Sawyer","Hayden","Blake"]
last_names = ["Bennett","Cooper","Diaz","Evans","Foster","Garcia","Hughes","Iverson","Johnson","Kim","Lopez","Miller","Nguyen","Ortiz","Patel","Robinson","Smith","Turner","Ueda","Vasquez"]

def rand_dob():
    start = date(1955,1,1)
    end = date(2002,12,31)
    return (start + (end - start) * random.random()).isoformat()

def currency(x): return "${:,.0f}".format(float(x))

def page(pdf, title, lines):
    fig = plt.figure(figsize=(8.5, 11)); fig.subplots_adjust(left=0.06, right=0.94, top=0.92, bottom=0.06)
    plt.text(0.5, 0.96, title, ha='center', va='top', fontsize=14, fontweight='bold')
    y = 0.92
    for ln in lines:
        if y < 0.08:
            plt.text(0.5, 0.04, "Synthetic sample for demo use only.", ha='center', va='bottom', fontsize=8)
            pdf.savefig(fig); plt.close(fig)
            fig = plt.figure(figsize=(8.5, 11)); fig.subplots_adjust(left=0.06, right=0.94, top=0.92, bottom=0.06)
            plt.text(0.5, 0.96, title, ha='center', va='top', fontsize=14, fontweight='bold')
            y = 0.92
        plt.text(0.06, y, ln, ha='left', va='top', fontsize=10, family='monospace'); y -= 0.018
    plt.text(0.5, 0.04, "Synthetic sample for demo use only.", ha='center', va='bottom', fontsize=8)
    pdf.savefig(fig); plt.close(fig)

# Enhanced booklets with comprehensive policy language
def booklet_lines(state_code, state_name):
    """Generate comprehensive, realistic homeowners policy booklet content"""
    
    # Table of Contents and Agreement
    toc_agreement = [
        f"HOMEOWNERS POLICY HO-3 | {state_name}",
        "",
        "TABLE OF CONTENTS",
        "AGREEMENT ................................................................ 3",
        "DEFINITIONS ............................................................. 3", 
        "SECTION I - PROPERTY COVERAGES ........................................... 5",
        "SECTION I - PERILS INSURED AGAINST ....................................... 9",
        "SECTION I - EXCLUSIONS .................................................. 11",
        "SECTION II - LIABILITY COVERAGES ........................................ 17",
        "STATE SPECIFIC PROVISIONS ............................................... 25",
        "",
        "AGREEMENT",
        "We will provide the insurance described in this policy in return for the premium",
        "and compliance with all applicable provisions of this policy.",
        "",
        "DEFINITIONS",
        "'You' and 'your' refer to the 'named insured' shown in the Declarations and the",
        "spouse if a resident of the same household. 'We', 'us' and 'our' refer to the",
        "Company providing this insurance.",
        "",
        "'Bodily injury' means bodily harm, sickness or disease, including death.",
        "'Business' means a trade, profession or occupation engaged in on a full-time,", 
        "part-time or occasional basis for money or other compensation.",
        "'Dwelling' means the one family dwelling where you reside, structures attached",
        "to the dwelling, and materials and supplies used to construct, alter or repair.",
        "'Occurrence' means an accident, including continuous or repeated exposure to",
        "substantially the same general harmful conditions, which results in bodily",
        "injury or property damage during the policy period.",
        "'Property damage' means physical injury to, destruction of, or loss of use of",
        "tangible property.",
        "'Residence premises' means the one family dwelling, other structures, and grounds",
        "or that part of any other building where you reside.",
    ]
    
    # Property Coverages
    property_coverages = [
        "",
        "SECTION I - PROPERTY COVERAGES",
        "",
        "Coverage A - Dwelling",
        "We cover the dwelling on the residence premises, including structures attached",
        "to the dwelling and materials and supplies used to construct, alter or repair",
        "the dwelling or other structures on the residence premises.",
        "",
        "Coverage B - Other Structures", 
        "We cover other structures on the residence premises set apart from the dwelling",
        "by clear space. The limit will not be more than 10% of Coverage A. We do not",
        "cover structures used for business or rented to others unless used solely as",
        "a private garage.",
        "",
        "Coverage C - Personal Property",
        "We cover personal property owned or used by an insured anywhere in the world.",
        "Our limit for personal property usually located at another residence is 10%",
        "of Coverage C or $1,000, whichever is greater.",
        "",
        "Special Limits of Liability:",
        "• $200 on money, bank notes, coins, gold, silver, platinum",
        "• $1,500 on securities, deeds, evidences of debt, manuscripts, records",
        "• $1,500 on watercraft including trailers, furnishings, equipment", 
        "• $1,500 for theft of jewelry, watches, furs, precious stones",
        "• $2,500 for theft of firearms and related equipment",
        "• $2,500 for theft of silverware, goldware, platinumware",
        "• $2,500 on business property on residence premises",
        "• $500 on business property away from residence premises",
        "",
        "Property Not Covered: Articles separately insured, animals, birds, fish,",
        "motor vehicles.",
        "",
        "Coverage D - Loss of Use",
        "If a covered loss makes the residence premises not fit to live in, we cover:",
        "1. Additional Living Expense - necessary increase in living expenses to",
        "   maintain your normal standard of living.",
        "2. Fair Rental Value - fair rental value of premises rented to others less",
        "   expenses that do not continue while not fit to live in.",
    ]
    
    # Perils and Exclusions
    perils_exclusions = [
        "",
        "SECTION I - PERILS INSURED AGAINST",
        "",
        "Coverage A and B - We insure against risks of direct physical loss except:",
        "• Earth movement, even if caused by human forces",
        "• Flood, surface water, waves, tidal waves, overflow of water bodies",
        "• Water damage from sewers, drains, or below surface ground water",  
        "• Power failure occurring off the residence premises",
        "• Neglect to use reasonable means to save and preserve property",
        "• War, civil war, insurrection, rebellion, warlike acts",
        "• Nuclear hazard",
        "• Intentional loss by an insured",
        "• Governmental action, destruction or seizure by authority",
        "• Weather conditions contributing to loss",
        "",
        "Coverage C - We insure against the following perils:",
        "• Fire or Lightning",
        "• Windstorm or Hail (items inside building only if roof or wall damaged)",
        "• Explosion",
        "• Riot or Civil Commotion",
        "• Aircraft (including self-propelled missiles and spacecraft)",
        "• Vehicles",
        "• Smoke",
        "• Vandalism or Malicious Mischief", 
        "• Theft",
        "• Falling Objects",
        "• Weight of Ice, Snow or Sleet",
        "• Accidental Discharge of Water or Steam",
        "• Sudden and Accidental Tearing Apart, Cracking, Burning or Bulging",
        "• Freezing",
        "• Sudden and Accidental Damage from Artificially Generated Electrical Current",
        "• Volcanic Eruption",
    ]
    
    # Liability Coverages
    liability_coverages = [
        "",
        "SECTION II - LIABILITY COVERAGES",
        "",
        "Coverage E - Personal Liability",
        "If a claim is made or suit brought against an insured for damages because of",
        "bodily injury or property damage caused by an occurrence to which this coverage",
        "applies, we will:",
        "1. Pay up to our limit of liability for damages for which an insured is",
        "   legally liable. Damages include prejudgment interest awarded against an insured.",
        "2. Provide a defense at our expense by counsel of our choice, even if the suit",
        "   is groundless, false or fraudulent. We may investigate and settle any claim",
        "   or suit that we decide can be settled.",
        "",
        "Coverage F - Medical Payments to Others", 
        "We will pay necessary medical expenses incurred or medically ascertained within",
        "three years from the date of an accident causing bodily injury. Medical expenses",
        "means reasonable charges for medical, surgical, x-ray, dental, ambulance,",
        "hospital, professional nursing, prosthetic devices and funeral services.",
        "",
        "This coverage applies to a person on the residence premises with permission",
        "of an insured or to a person off the residence premises if the bodily injury",
        "arises out of a condition on the residence premises or is caused by the",
        "activities of an insured, a residence employee, or an animal owned by an insured.",
        "",
        "SECTION II - EXCLUSIONS",
        "",
        "Coverage E and F do not apply to bodily injury or property damage:",
        "• Expected or intended by an insured",
        "• Arising out of business pursuits of an insured",
        "• Arising out of professional services",
        "• Arising out of premises owned, rented or controlled by an insured other",
        "  than an insured location",
        "• Arising out of ownership, maintenance, occupancy, operation, use, loading",
        "  or unloading of motor vehicles, aircraft, hovercraft, or watercraft",
        "• Caused directly or indirectly by war, civil war, insurrection, rebellion",
        "• Arising out of the transmission of a communicable disease by an insured",
        "• Arising out of sexual molestation, corporal punishment or physical or",
        "  mental abuse",
        "• Arising out of the use, sale, manufacture, delivery, transfer or possession",
        "  of a controlled substance",
    ]
    
    # State-specific provisions
    state_provisions = {
        "CA": [
            "",
            "CALIFORNIA SPECIFIC PROVISIONS",
            "",
            "CALIFORNIA CONSUMER NOTICE",
            "This policy provides certain coverage for personal property of others while",
            "on the part of the residence premises occupied by an insured. However, this",
            "is not a substitute for insurance which should be carried by the owners of",
            "such property.",
            "",
            "WILDFIRE RISK NOTICE", 
            "California residents should be aware that wildfire is a significant risk in",
            "many areas of the state. This policy covers direct physical loss from fire,",
            "including wildfire, subject to your deductible and policy terms.",
            "",
            "EARTHQUAKE COVERAGE",
            "This policy does not cover earthquakes. Earthquake coverage is available",
            "through the California Earthquake Authority or by separate endorsement.",
            "",
            "FAIR PLAN ELIGIBILITY",
            "If you are unable to obtain insurance through the voluntary market, you may",
            "be eligible for coverage through the California FAIR Plan.",
            "",
            "CLAIMS SETTLEMENT",
            "In case of loss, you must give immediate notice to the company or its agent.",
            "You must also protect the property from further damage and make reasonable",
            "and necessary repairs to protect the property.",
        ],
        "TX": [
            "",
            "TEXAS SPECIFIC PROVISIONS",
            "",
            "TEXAS WINDSTORM AND HAIL DEDUCTIBLE",
            "In accordance with Texas Insurance Code, if your policy includes a percentage", 
            "deductible for windstorm and hail losses, such deductible applies separately",
            "to each loss and is calculated as a percentage of Coverage A - Dwelling.",
            "",
            "TEXAS CONSUMER BILL OF RIGHTS",
            "As a Texas insurance consumer, you have certain rights under the Texas",
            "Insurance Code. For more information about your rights, contact the Texas",
            "Department of Insurance at 1-800-252-3439 or www.tdi.texas.gov.",
            "",
            "PAYMENT OF CLAIMS",
            "Texas law requires payment of claims within specific time frames. We will",
            "acknowledge receipt of your claim within 15 days and begin investigation",
            "promptly. We will notify you in writing if we need additional time.",
            "",
            "APPRAISAL PROCESS",
            "If you and we fail to agree on the amount of loss, either may demand an",
            "appraisal of the loss. Each party will select a competent and impartial",
            "appraiser. The two appraisers will select an umpire.",
        ],
        "TN": [
            "",
            "TENNESSEE SPECIFIC PROVISIONS",
            "",
            "TENNESSEE LOSS SETTLEMENT",
            "In accordance with Tennessee law, losses under this policy will be settled",
            "on the basis of replacement cost without deduction for depreciation, subject",
            "to specific conditions regarding repair or replacement completion.",
            "",
            "TENNESSEE CANCELLATION PROVISIONS", 
            "This policy may be cancelled by us only for the reasons stated in Tennessee",
            "Code Annotated § 56-7-2502. We will give you at least 30 days advance",
            "written notice of cancellation, except for non-payment of premium.",
            "",
            "TENNESSEE CLAIM PROCEDURES",
            "Tennessee law provides certain protections regarding the handling of insurance",
            "claims. You have the right to select your own contractor for repairs and to",
            "receive claim payments in a timely manner.",
        ]
    }
    
    return toc_agreement + property_coverages + perils_exclusions + liability_coverages + state_provisions[state_code]

def upload_pdf_to_supabase(supabase: Client, pdf_path: str, storage_path: str) -> str:
    """Upload PDF to Supabase storage and return the public URL"""
    try:
        with open(pdf_path, 'rb') as f:
            pdf_data = f.read()
        
        # Upload to storage
        result = supabase.storage.from_('homefax-documents').upload(
            path=storage_path,
            file=pdf_data,
            file_options={'content-type': 'application/pdf'}
        )
        
        if result:
            return storage_path
        else:
            print(f"Failed to upload {pdf_path}")
            return None
            
    except Exception as e:
        print(f"Error uploading {pdf_path}: {str(e)}")
        return None

def create_policyholder_record(holder_data: Dict) -> Dict[str, Any]:
    """Create a policyholder record for Supabase"""
    return {
        "holder_id": holder_data["holder_id"],
        "first_name": holder_data["first_name"],
        "last_name": holder_data["last_name"],
        "date_of_birth": holder_data["date_of_birth"],
        "email": holder_data["email"],
        "phone": holder_data["phone"],
        "mailing_address": {
            "street": holder_data["mailing_address"],
            "city": holder_data["mailing_city"],
            "state": holder_data["mailing_state"],
            "zip": holder_data["mailing_zip"]
        }
    }

def create_policy_record(policyholder_id: str, policy_data: Dict, property_data: Dict, 
                        coverage_data: Dict, premium_data: Dict, endorsements: List[str],
                        deductible_data: Dict, mortgagee_data: Dict, agent_data: Dict,
                        document_paths: List[str], state_specific_data: Dict) -> Dict[str, Any]:
    """Create a policy record in the format expected by Supabase"""
    
    # Build endorsements array
    endorsement_list = []
    form_mapping = {
        "Water Backup": "HO 04 95",
        "Service Line": "HO 04 97", 
        "Ordinance or Law 10%": "HO 04 77",
        "Ordinance or Law 25%": "HO 04 77",
        "ID Theft": "HO 04 53",
        "Equipment Breakdown": "HO 04 12",
        "Roof ACV": "HO 04 08",
        "Animal Liability Sublimit": "HO 04 24"
    }
    
    for endorsement in endorsements:
        form_key = next((key for key in form_mapping.keys() if key in endorsement), None)
        endorsement_obj = {
            "name": endorsement,
            "form_number": form_mapping.get(form_key, ""),
        }
        # Add specific limits for certain endorsements
        if "Water Backup" in endorsement or "Service Line" in endorsement:
            endorsement_obj["limit"] = 10000
        elif "ID Theft" in endorsement:
            endorsement_obj["limit"] = 25000
        elif "Equipment Breakdown" in endorsement:
            endorsement_obj["limit"] = 50000
        elif "Animal Liability" in endorsement:
            endorsement_obj["limit"] = 25000
            
        endorsement_list.append(endorsement_obj)
    
    # Build documents array
    documents_list = []
    for doc_path in document_paths:
        doc_type = "booklet" if "Booklet_" in doc_path else "declaration"
        filename = os.path.basename(doc_path)
        documents_list.append({
            "type": doc_type,
            "filename": filename,
            "storage_path": doc_path,
            "pages": 3 if doc_type == "declaration" else 1
        })
    
    # Build mortgagees array
    mortgagees_list = []
    if mortgagee_data.get("name"):
        mortgagees_list.append({
            "name": mortgagee_data["name"],
            "loan_number": mortgagee_data["loan_number"],
            "address": mortgagee_data.get("address", "")
        })
    
    return {
        "policy_number": policy_data["policy_id"],
        "carrier": policy_data["carrier"],
        "policy_type": "homeowners",
        "status": policy_data["status"].lower(),
        "data_source": "generated_sample",
        "policyholder_id": policyholder_id,  # Foreign key reference
        
        "policy_period": {
            "effective_date": policy_data["effective_date"],
            "expiration_date": policy_data["expiration_date"],
            "term_months": 12
        },
        
        "property": {
            "address": {
                "street": property_data["address"],
                "city": property_data["city"],
                "state": property_data["state"],
                "zip": property_data["zip"]
            },
            "details": {
                "year_built": property_data["year_built"],
                "square_feet": property_data["square_feet"],
                "stories": property_data["stories"],
                "construction_type": property_data["construction_type"],
                "roof_type": property_data["roof_type"],
                "occupancy_type": property_data["occupancy_type"],
                "has_security_system": property_data["has_security_system"],
                "distance_to_fire_station_miles": property_data["distance_to_fire_station_miles"]
            }
        },
        
        "coverages": {
            "dwelling": {"limit": coverage_data["coverage_a"], "code": "A"},
            "other_structures": {"limit": coverage_data["coverage_b"], "code": "B"},
            "personal_property": {"limit": coverage_data["coverage_c"], "code": "C"},
            "loss_of_use": {"limit": coverage_data["coverage_d"], "code": "D"},
            "personal_liability": {"limit": coverage_data["liability_limit"], "code": "E"},
            "medical_payments": {"limit": coverage_data["med_pay_limit"], "code": "F"}
        },
        
        "deductibles": deductible_data,
        "endorsements": endorsement_list,
        "premium": premium_data,
        "mortgagees": mortgagees_list,
        "agent": agent_data,
        "documents": documents_list,
        "state_specific": state_specific_data,
        
        "raw_data": {
            "original_format": "generated_sample",
            "discounts": property_data.get("discounts", {}),
            "generation_metadata": {
                "script_version": "2.1",
                "generated_at": date.today().isoformat()
            }
        },
        
        "ingestion_metadata": {
            "batch_id": f"batch_{date.today().isoformat()}",
            "processing_time": None,
            "validation_status": "passed"
        }
    }

# Generate booklets and upload to Supabase
def generate_and_upload_booklets(supabase: Client) -> Dict[str, str]:
    """Generate booklets and upload them to Supabase storage"""
    booklet_paths = {}
    
    for st in states:
        filename = f"Booklet_{st['code']}.pdf"
        local_path = os.path.join(pdf_dir, filename)
        storage_path = f"booklets/{st['code']}/{filename}"
        
        # Generate booklet PDF
        with PdfPages(local_path) as pdf:
            lines = booklet_lines(st["code"], st["name"])
            page(pdf, f"Homeowners Policy Booklet | {st['name']}", lines)
        
        # Upload to Supabase
        uploaded_path = upload_pdf_to_supabase(supabase, local_path, storage_path)
        if uploaded_path:
            booklet_paths[st["code"]] = uploaded_path
            print(f"✓ Uploaded booklet for {st['name']}")
        else:
            print(f"✗ Failed to upload booklet for {st['name']}")
    
    return booklet_paths

# Coverages and endorsements (same as original)
def pick_coverages(year_built):
    A = random.choice([150000, 250000, 350000, 500000, 750000, 1000000, 1200000])
    B = int(A * 0.10)
    C = int(A * random.choice([0.5, 0.6, 0.7]))
    D = int(A * random.choice([0.2, 0.25, 0.3]))
    liab = random.choice([100000, 300000, 500000])
    med = random.choice([1000, 5000, 10000])
    return A,B,C,D,liab,med

def pick_deductible(state_code, roof_age):
    if state_code == "TX" and random.random() < 0.6:
        return {"type": "percentage", "percentage": random.choice([0.01, 0.02, 0.03]), "of": "dwelling"}
    return {"type": "flat", "amount": random.choice([500,1000,1500,2500] if roof_age < 15 else [1000,1500,2500])}

pool = {
    "TN": ["Water Backup","Service Line","Ordinance or Law 10%","ID Theft","Equipment Breakdown"],
    "TX": ["Water Backup","Service Line","Ordinance or Law 10%","Roof ACV","Animal Liability Sublimit"],
    "CA": ["Water Backup","Ordinance or Law 25%","ID Theft","Equipment Breakdown"]
}

def choose_endorsements(state_code, year_built):
    picks = random.sample(pool[state_code], k=random.randint(2,3))
    if year_built < 1990 and not any("Ordinance or Law" in x for x in picks):
        picks.append(random.choice(["Ordinance or Law 10%","Ordinance or Law 25%"]))
    return picks

def generate_premium_breakdown(annual_premium, endorsements, has_sec, state_code):
    """Generate detailed premium breakdown"""
    base_premium = annual_premium * 0.85
    endorsement_premium = annual_premium * 0.08
    discount_amount = annual_premium * 0.03 if has_sec else 0
    
    # State-specific taxes and fees
    state_rates = {
        "CA": {"tax": 0.0275, "fee": 2.25},
        "TX": {"tax": 0.036, "fee": 7.50}, 
        "TN": {"tax": 0.0435, "fee": 5.00}
    }
    
    tax_rate = state_rates[state_code]["tax"]
    state_fee = state_rates[state_code]["fee"]
    
    subtotal = base_premium + endorsement_premium - discount_amount
    tax_amount = subtotal * tax_rate
    total_premium = subtotal + tax_amount + state_fee
    
    return {
        "annual_total": round(total_premium, 2),
        "breakdown": {
            "base_premium": round(base_premium, 2),
            "endorsement_premium": round(endorsement_premium, 2),
            "discounts": round(-discount_amount, 2) if has_sec else 0,
            "subtotal": round(subtotal, 2),
            "state_tax": round(tax_amount, 2),
            "state_fee": round(state_fee, 2)
        },
        "payment_plan": "annual",
        "monthly_option": round(total_premium/12, 2)
    }

def main():
    """Main function to generate policies and upload to Supabase"""
    print("🏠 HomeFax Policy Generator with Supabase Integration")
    print("=" * 60)
    
    # Initialize Supabase
    try:
        supabase = init_supabase()
        print("✓ Connected to Supabase")
    except Exception as e:
        print(f"✗ Failed to connect to Supabase: {e}")
        print("Please set SUPABASE_ANON_KEY environment variable")
        return
    
    # Generate and upload booklets
    print("\n📚 Generating and uploading policy booklets...")
    booklet_paths = generate_and_upload_booklets(supabase)
    
    # Generate and insert policyholders first
    print("\n👥 Generating and inserting policyholders...")
    holders = []
    policyholder_ids = {}  # Map holder_id to UUID
    
    for i in range(1, 25):
        fn, ln = random.choice(first_names), random.choice(last_names)
        holder_data = {
            "holder_id": f"H{i:04d}",
            "first_name": fn, "last_name": ln,
            "date_of_birth": rand_dob(),
            "email": f"{fn.lower()}.{ln.lower()}{i}@example.com",
            "phone": f"({random.randint(200,999)}) {random.randint(200,999)}-{random.randint(1000,9999)}",
            "mailing_address": f"{random.randint(100,9999)} {random.choice(streets)}",
            "mailing_city": random.choice(sum([v for v in state_cities.values()], [])),
            "mailing_state": random.choice([s["code"] for s in states]),
            "mailing_zip": random.choice(sum([v for v in state_zips.values()], []))
        }
        holders.append(holder_data)
        
        # Insert policyholder into Supabase
        try:
            policyholder_record = create_policyholder_record(holder_data)
            result = supabase.table('policyholders').insert(policyholder_record).execute()
            
            if result.data:
                # Store the UUID for later use
                policyholder_ids[holder_data["holder_id"]] = result.data[0]["id"]
                print(f"✓ Created policyholder {holder_data['holder_id']}: {fn} {ln}")
            else:
                print(f"✗ Failed to create policyholder {holder_data['holder_id']}")
                
        except Exception as e:
            print(f"✗ Error creating policyholder {holder_data['holder_id']}: {str(e)}")
            continue
    
    # Generate policies
    print("\n📋 Generating policies and uploading to Supabase...")
    holders_iter = iter(holders * 2)
    policy_count = 0
    
    for st in states:
        for i in range(1, 11):  # 10 policies per state
            try:
                holder = next(holders_iter)
                city = random.choice(state_cities[st["code"]])
                address = f"{random.randint(100, 9999)} {random.choice(streets)}"
                zipc = random.choice(state_zips[st["code"]])
                year_built = random.randint(1950, 2023)
                roof_type = random.choice(roof_types)
                construction = random.choice(construction_types)
                square_feet = random.randint(900, 4000)
                stories = random.choice([1,2])
                has_sec = random.choice([True, False])
                distance_fs = round(random.uniform(0.1, 8.0), 1)
                occupancy = random.choice(occupancy_types)

                A,B,C,D,liab,med = pick_coverages(year_built)
                roof_age = 2025 - year_built
                deductible_data = pick_deductible(st["code"], roof_age)
                endorsements = choose_endorsements(st["code"], year_built)

                premium_base = np.interp(A, [150000, 1200000], [700, 3800])
                premium_mod = (0.9 if deductible_data.get('type')=='percentage' else 1.0) * (0.95 if has_sec else 1.0) * (1.1 if roof_age>25 else 1.0)
                annual_premium = round(premium_base * premium_mod, 2)

                eff_year = random.choice([2024,2025])
                eff = date(eff_year, random.randint(1,12), random.randint(1,28))
                exp = date(eff.year+1 if eff.month==12 else eff.year, eff.month, min(28, eff.day))

                mort_flag = random.random() < 0.7
                mort_name = random.choice(["First National Mortgage","AmeriHome Lending","United Bank Home Loans"]) if mort_flag else ""
                mort_loan = f"{random.randint(10**9, 10**10-1)}" if mort_flag else ""

                discounts = {"Alarm": has_sec, "New Roof": roof_age <= 10, "Claim-Free": random.random() < 0.6, "Bundle": random.random() < 0.3}

                pol_id = f"P{st['code']}{i:03d}"
                carrier = random.choice(carriers)
                
                # Generate PDF declaration
                filename = f"{holder['last_name']}_{holder['first_name']}_HOME_{pol_id}.pdf".replace(" ","")
                local_pdf_path = os.path.join(pdf_dir, filename)
                storage_pdf_path = f"declarations/{eff.year}/{filename}"
                
                # Create simplified PDF (you can expand this with the full content)
                with PdfPages(local_pdf_path) as pdf:
                    lines = [
                        f"Policy Number: {pol_id}",
                        f"Carrier: {carrier}",
                        f"Named Insured: {holder['first_name']} {holder['last_name']}",
                        f"Property: {address}, {city}, {st['code']} {zipc}",
                        f"Coverage A: {currency(A)}",
                        f"Annual Premium: {currency(annual_premium)}",
                        f"Effective: {eff.isoformat()} to {exp.isoformat()}"
                    ]
                    page(pdf, f"{carrier} | Policy Declarations", lines)
                
                # Upload PDF to Supabase
                uploaded_pdf_path = upload_pdf_to_supabase(supabase, local_pdf_path, storage_pdf_path)
                
                # Prepare data structures
                policy_data = {
                    "policy_id": pol_id,
                    "carrier": carrier,
                    "effective_date": eff.isoformat(),
                    "expiration_date": exp.isoformat(),
                    "status": random.choice(["Active","Pending Renewal"])
                }
                
                property_data = {
                    "address": address, "city": city, "state": st["code"], "zip": zipc,
                    "occupancy_type": occupancy, "construction_type": construction,
                    "roof_type": roof_type, "year_built": year_built,
                    "square_feet": square_feet, "stories": stories,
                    "has_security_system": has_sec, "distance_to_fire_station_miles": distance_fs,
                    "discounts": discounts
                }
                
                coverage_data = {
                    "coverage_a": A, "coverage_b": B, "coverage_c": C, "coverage_d": D,
                    "liability_limit": liab, "med_pay_limit": med
                }
                
                premium_data = generate_premium_breakdown(annual_premium, endorsements, has_sec, st['code'])
                
                mortgagee_data = {
                    "name": mort_name,
                    "loan_number": mort_loan,
                    "address": f"{random.randint(100,9999)} Finance Center Dr, {random.choice(['Dallas, TX 75201', 'Charlotte, NC 28202', 'Phoenix, AZ 85034'])}" if mort_flag else ""
                }
                
                agent_names = ["Sarah Johnson", "Michael Chen", "Lisa Rodriguez", "David Kim", "Jennifer Adams"]
                agent_name = random.choice(agent_names)
                agent_data = {
                    "name": agent_name,
                    "license": f"{random.choice(['AG', 'IN', 'LI'])}{random.randint(100000,999999)}",
                    "phone": f"({random.randint(200,999)}) {random.randint(200,999)}-{random.randint(1000,9999)}",
                    "email": f"{agent_name.lower().replace(' ', '.')}@{carrier.lower().replace(' ', '').replace('&', '')}insurance.com"
                }
                
                # Document paths
                document_paths = []
                if uploaded_pdf_path:
                    document_paths.append(uploaded_pdf_path)
                if st["code"] in booklet_paths:
                    document_paths.append(booklet_paths[st["code"]])
                
                # State-specific data
                state_specific_data = {}
                if st["code"] == "TX":
                    state_specific_data = {
                        "texas": {
                            "windstorm_deductible": "percentage" if deductible_data.get('type') == 'percentage' else "flat",
                            "consumer_rights_notice": True,
                            "appraisal_clause": True
                        }
                    }
                elif st["code"] == "CA":
                    state_specific_data = {
                        "california": {
                            "wildfire_notice": True,
                            "earthquake_exclusion": True,
                            "fair_plan_eligible": True
                        }
                    }
                elif st["code"] == "TN":
                    state_specific_data = {
                        "tennessee": {
                            "replacement_cost_settlement": True,
                            "cancellation_provisions": True
                        }
                    }
                
                # Get the policyholder UUID
                policyholder_uuid = policyholder_ids.get(holder["holder_id"])
                if not policyholder_uuid:
                    print(f"✗ No UUID found for policyholder {holder['holder_id']}")
                    continue
                
                # Create policy record
                policy_record = create_policy_record(
                    policyholder_uuid, policy_data, property_data, coverage_data, premium_data,
                    endorsements, deductible_data, mortgagee_data, agent_data,
                    document_paths, state_specific_data
                )
                
                # Insert into Supabase
                result = supabase.table('policies').insert(policy_record).execute()
                
                if result.data:
                    policy_count += 1
                    print(f"✓ Created policy {pol_id} for {holder['first_name']} {holder['last_name']}")
                else:
                    print(f"✗ Failed to create policy {pol_id}")
                    
            except Exception as e:
                print(f"✗ Error creating policy {pol_id}: {str(e)}")
                continue
    
    print(f"\n🎉 Successfully created data in Supabase!")
    print(f"👥 Policyholders: {len(policyholder_ids)} unique individuals")
    print(f"📋 Policies: {policy_count} policies across {len(states)} states")
    print(f"📁 Storage: {len(booklet_paths)} booklets + {policy_count} declarations")
    
    # Test queries with relationships
    print("\n🔍 Testing database queries...")
    try:
        # Test policy summary view (with joins)
        result = supabase.table('policy_summary').select('policy_number, carrier, first_name, last_name, property_state').limit(5).execute()
        print("Sample policies with policyholders:")
        for policy in result.data:
            print(f"  - {policy['policy_number']} ({policy['carrier']}) - {policy['first_name']} {policy['last_name']} in {policy['property_state']}")
        
        # Test policyholder with policy count
        result = supabase.rpc('get_policyholders_with_policy_count').limit(5).execute()
        print("\nPolicyholders with policy counts:")
        for holder in result.data:
            print(f"  - {holder['first_name']} {holder['last_name']} ({holder['holder_id']}): {holder['policy_count']} policies")
            
    except Exception as e:
        print(f"Query test failed: {e}")

if __name__ == "__main__":
    main()
