# Faster generation: 3 state booklets + 30 one-page declarations PDFs (no append) + manifests + policyholders CSV.
# This keeps runtime low and provides clean mapping between policies and booklets via state_code.
import os, random, json, textwrap
from datetime import date, timedelta
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
from zipfile import ZipFile, ZIP_DEFLATED

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

booklets = {}
for st in states:
    fpath = os.path.join(pdf_dir, f"Booklet_{st['code']}.pdf")
    with PdfPages(fpath) as pdf:
        lines = booklet_lines(st["code"], st["name"])
        page(pdf, f"Homeowners Policy Booklet | {st['name']}", lines)
    booklets[st["code"]] = fpath

# Policyholders
holders = []
for i in range(1, 25):
    fn, ln = random.choice(first_names), random.choice(last_names)
    holders.append({
        "holder_id": f"H{i:04d}",
        "first_name": fn, "last_name": ln,
        "date_of_birth": rand_dob(),
        "email": f"{fn.lower()}.{ln.lower()}{i}@example.com",
        "phone": f"({random.randint(200,999)}) {random.randint(200,999)}-{random.randint(1000,9999)}",
        "mailing_address": f"{random.randint(100,9999)} {random.choice(streets)}",
        "mailing_city": random.choice(sum([v for v in state_cities.values()], [])),
        "mailing_state": random.choice([s["code"] for s in states]),
        "mailing_zip": random.choice(sum([v for v in state_zips.values()], []))
    })
holders_df = pd.DataFrame(holders)

# Coverages and endorsements
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
        return "percent_wind_hail", random.choice([0.01, 0.02, 0.03])
    return "flat", random.choice([500,1000,1500,2500] if roof_age < 15 else [1000,1500,2500])

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

def generate_endorsement_content(endorsements, state_code):
    """Generate detailed endorsement content for the policy"""
    content = []
    
    for endorsement in endorsements:
        if "Water Backup" in endorsement:
            content.extend([
                "HO 04 95 - WATER BACKUP AND SUMP DISCHARGE OR OVERFLOW",
                "Coverage Extension for Water Backup and Sump Discharge or Overflow",
                "",
                "We insure for direct physical loss to property covered under Section I",
                "caused by water which backs up through sewers or drains or which enters",
                "the dwelling through sump pump discharge or overflow, subject to the",
                "following provisions:",
                "",
                "1. Our liability for all loss in any one occurrence is limited to $10,000.",
                "2. We will not pay for loss to the system of pipes, equipment or drains",
                "   located below the surface of the ground within the residence premises.",
                "3. This coverage is additional insurance.",
                "",
            ])
        
        elif "Service Line" in endorsement:
            content.extend([
                "HO 04 97 - SERVICE LINE COVERAGE",
                "Coverage for Service Lines", 
                "",
                "We insure for direct physical loss to service lines on the residence",
                "premises caused by the following perils:",
                "• Freezing • Accidental damage from the weight of equipment",
                "• Collapse of land or improved property • Vandalism or malicious mischief",
                "",
                "Service line means underground pipes, lines, cables and wires that supply",
                "utility services to the dwelling including water, gas, steam, electric,",
                "telephone, cable television, and internet services.",
                "",
                "The most we will pay is $10,000 for any one loss to all service lines",
                "combined. This coverage is additional insurance.",
                "",
            ])
            
        elif "Ordinance or Law" in endorsement:
            percentage = "10%" if "10%" in endorsement else "25%"
            coverage_limit = "10%" if percentage == "10%" else "25%"
            content.extend([
                f"HO 04 77 - ORDINANCE OR LAW COVERAGE ({percentage})",
                f"Additional Coverage for Ordinance or Law - {coverage_limit} of Coverage A",
                "",
                "We will pay the increased costs you incur due to the enforcement of",
                "ordinances or laws in the course of repair or reconstruction of damaged",
                "parts of a covered building, subject to the following:",
                "",
                f"1. The most we will pay under this endorsement is {coverage_limit} of the",
                "   Coverage A limit shown in the Declarations.",
                "2. We will not pay for the increased cost until the property is actually",
                "   repaired or replaced, on the same or another premises.",
                "3. This coverage applies only when the building sustains covered damage",
                "   and the ordinance or law is in force at the time of loss.",
                "",
            ])
            
        elif "ID Theft" in endorsement:
            content.extend([
                "HO 04 53 - IDENTITY FRAUD EXPENSE COVERAGE",
                "Coverage for Identity Fraud Expenses",
                "",
                "We will reimburse an insured for identity fraud expenses, up to $25,000",
                "in the aggregate for all identity fraud events during the policy period.",
                "",
                "Identity fraud expenses means:",
                "• Re-filing applications for loans, grants or other credit instruments",
                "• Notarizing affidavits or similar documents and long distance calls",
                "• Up to $500 for lost wages due to time off work",
                "• Reasonable fees for up to 4 credit reports per year",
                "",
                "We do not cover expenses for legal actions brought by or against an insured.",
                "",
            ])
            
        elif "Equipment Breakdown" in endorsement:
            content.extend([
                "HO 04 12 - EQUIPMENT BREAKDOWN COVERAGE",
                "Additional Coverage for Equipment Breakdown",
                "",
                "We will pay for direct physical loss to covered property caused by or",
                "resulting from an accident to covered equipment. The most we will pay",
                "is $50,000 for any one accident.",
                "",
                "Covered equipment means equipment that generates, transmits or utilizes",
                "energy including pressure or vacuum equipment located on the residence",
                "premises and used primarily for residential purposes.",
                "",
                "We also provide up to $500 for spoilage of covered property in a",
                "refrigerator or freezer on the residence premises due to power interruption",
                "on the residence premises that results from an accident to covered equipment.",
                "",
            ])
            
        elif "Roof ACV" in endorsement:
            content.extend([
                "HO 04 08 - ROOF SURFACE COVERAGE - ACTUAL CASH VALUE",
                "Actual Cash Value Loss Settlement for Roof Surfaces",
                "",
                "The following changes apply to the Loss Settlement condition:",
                "",
                "Loss to roof surfaces will be settled on an actual cash value basis.",
                "Roof surfaces means the roof covering and its underlayment, gutters,",
                "downspouts, roof sheathing, and directly supporting framework.",
                "",
                "This change does not apply to roof surfaces damaged by fire, lightning,",
                "explosion, windstorm, hail, aircraft, vehicles, vandalism, malicious",
                "mischief, theft, or volcanic eruption.",
                "",
            ])
            
        elif "Animal Liability" in endorsement:
            content.extend([
                "HO 04 24 - ANIMAL LIABILITY EXCLUSION WITH LIMITED COVERAGE",
                "Limited Coverage for Animal Liability",
                "",
                "Coverage E - Personal Liability and Coverage F - Medical Payments to Others",
                "do not apply to bodily injury or property damage arising out of the",
                "ownership, maintenance, use or entrustment to others of any animal.",
                "",
                "Exception: This exclusion does not apply to bodily injury to others or",
                "damage to property of others arising out of the ownership, maintenance",
                "or use of animals other than dogs, subject to a limit of $25,000 per occurrence.",
                "",
            ])
            
    return content

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
    
    breakdown = [
        "PREMIUM BREAKDOWN",
        "",
        f"Base Coverage Premium                               ${base_premium:8.2f}",
        f"Endorsement Premium                                ${endorsement_premium:8.2f}",
    ]
    
    if has_sec:
        breakdown.append(f"Security System Discount                          -${discount_amount:8.2f}")
        
    breakdown.extend([
        f"                                                   -----------",
        f"Subtotal                                           ${subtotal:8.2f}",
        f"State Premium Tax ({tax_rate:.3%})                        ${tax_amount:8.2f}",
        f"State Filing Fee                                   ${state_fee:8.2f}",
        f"                                                   -----------",
        f"TOTAL ANNUAL PREMIUM                               ${total_premium:8.2f}",
        "",
        f"Monthly Payment Option: ${total_premium/12:6.2f} per month (with 2% processing fee)",
        "",
    ])
    
    return breakdown

# Build 30 multi-page declaration PDFs with detailed content
policies = []
manifest_rows = []
policy_pdfs = []
holders_iter = iter(holders_df.to_dict("records") * 2)

for st in states:
    for i in range(1, 10+1):
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
        ded_type, ded_val = pick_deductible(st["code"], roof_age)
        endorsements = choose_endorsements(st["code"], year_built)

        premium_base = np.interp(A, [150000, 1200000], [700, 3800])
        premium_mod = (0.9 if ded_type=='percent_wind_hail' else 1.0) * (0.95 if has_sec else 1.0) * (1.1 if roof_age>25 else 1.0)
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
        policy_row = {
            "policy_id": pol_id,
            "holder_id": holder["holder_id"],
            "state_code": st["code"],
            "state": st["name"],
            "carrier": carrier,
            "effective_date": eff.isoformat(),
            "expiration_date": exp.isoformat(),
            "coverage_form": "HO-3",
            "annual_premium": annual_premium,
            "deductible_type": ded_type,
            "deductible_value": ded_val,
            "has_mortgagee": mort_flag,
            "mortgagee_name": mort_name,
            "mortgagee_loan_no": mort_loan,
            "status": random.choice(["Active","Pending Renewal"])
        }
        prop = {
            "address": address, "city": city, "state": st["code"], "zip": zipc,
            "occupancy_type": occupancy, "construction_type": construction,
            "roof_type": roof_type, "year_built": year_built,
            "square_feet": square_feet, "stories": stories,
            "has_security_system": has_sec, "distance_to_fire_station_miles": distance_fs,
            "discounts": discounts
        }

        # Generate enhanced declarations content with multiple pages
        
        # Page 1: Main Declarations
        page1_lines = [
            f"Policy Number: {pol_id}",
            f"Carrier: {carrier}",
            f"State: {st['name']}",
            f"Policy Period: {eff.isoformat()} to {exp.isoformat()}",
            f"Coverage Form: HO-3 Special Form",
            "",
            "NAMED INSURED",
            f"{holder['first_name']} {holder['last_name']}",
            f"Date of Birth: {holder['date_of_birth']}", 
            f"Phone: {holder['phone']}",
            f"Email: {holder['email']}",
            "",
            "MAILING ADDRESS",
            f"{holder['mailing_address']}",
            f"{holder['mailing_city']}, {holder['mailing_state']} {holder['mailing_zip']}",
            "",
            "RESIDENCE PREMISES",
            f"{address}",
            f"{city}, {st['code']} {zipc}",
            "",
            "SECTION I - PROPERTY COVERAGES AND LIMITS",
            f"Coverage A - Dwelling                              {currency(A)}",
            f"Coverage B - Other Structures                      {currency(B)}",
            f"Coverage C - Personal Property                     {currency(C)}",
            f"Coverage D - Loss of Use                           {currency(D)}",
            "",
            "SECTION II - LIABILITY COVERAGES AND LIMITS", 
            f"Coverage E - Personal Liability (Each Occurrence)  {currency(liab)}",
            f"Coverage F - Medical Payments (Each Person)        {currency(med)}",
            "",
            "DEDUCTIBLES",
            f"All Perils Deductible: {'{:.0%}'.format(ded_val)+' of Coverage A (Wind/Hail)' if ded_type=='percent_wind_hail' else currency(ded_val)}",
            "",
            "PROPERTY INFORMATION",
            f"Year Built: {year_built}    Square Feet: {square_feet:,}    Stories: {stories}",
            f"Construction Type: {construction}    Roof Type: {roof_type}",
            f"Occupancy: {occupancy}",
            f"Protection Class: {random.randint(1,10)}    Fire Station Distance: {distance_fs} mi",
            f"Security System: {'Yes' if has_sec else 'No'}",
            "",
            f"ANNUAL PREMIUM: {currency(annual_premium)}",
        ]
        
        # Generate premium breakdown
        premium_breakdown = generate_premium_breakdown(annual_premium, endorsements, has_sec, st['code'])
        
        # Generate endorsement content
        endorsement_content = generate_endorsement_content(endorsements, st['code'])
        
        # Page 2: Premium breakdown and forms schedule
        page2_lines = premium_breakdown + [
            "",
            "FORMS AND ENDORSEMENTS SCHEDULE",
            "",
            "The following forms and endorsements are made part of this policy:",
            "",
            "HO 00 03 05 11    Special Form (HO-3)",
            "HO 04 90 05 11    Personal Property Replacement Cost",
            "HO 04 10 05 11    Scheduled Personal Property", 
            "HO 04 91 05 11    Additional Living Expense",
        ]
        
        # Add endorsement form numbers
        form_mapping = {
            "Water Backup": "HO 04 95 05 11",
            "Service Line": "HO 04 97 05 11", 
            "Ordinance or Law 10%": "HO 04 77 05 11",
            "Ordinance or Law 25%": "HO 04 77 05 11",
            "ID Theft": "HO 04 53 05 11",
            "Equipment Breakdown": "HO 04 12 05 11",
            "Roof ACV": "HO 04 08 05 11",
            "Animal Liability Sublimit": "HO 04 24 05 11"
        }
        
        for endorsement in endorsements:
            form_key = next((key for key in form_mapping.keys() if key in endorsement), None)
            if form_key:
                page2_lines.append(f"{form_mapping[form_key]}    {endorsement}")
        
        page2_lines.extend([
            "",
            "SPECIAL LIMITS OF LIABILITY",
            "The following special limits apply to personal property:",
            "",
            "$200    Money, bank notes, bullion, coins, medals",
            "$1,500  Securities, accounts, deeds, manuscripts, records",
            "$1,500  Watercraft, trailers, furnishings, equipment",
            "$1,500  Theft of jewelry, watches, furs, precious stones",
            "$2,500  Theft of firearms and related equipment", 
            "$2,500  Theft of silverware, goldware, platinumware",
            "$2,500  Business property on residence premises",
            "$500    Business property away from residence premises",
            "",
        ])
        
        # Add mortgagee information if applicable
        if mort_flag:
            page2_lines.extend([
                "MORTGAGEE INFORMATION",
                f"Name: {mort_name}",
                f"Loan Number: {mort_loan}",
                f"Address: {random.randint(100,9999)} Finance Center Dr",
                f"         {random.choice(['Dallas, TX 75201', 'Charlotte, NC 28202', 'Phoenix, AZ 85034'])}",
                "",
            ])
        
        # Add agent information  
        agent_names = ["Sarah Johnson", "Michael Chen", "Lisa Rodriguez", "David Kim", "Jennifer Adams"]
        agent_name = random.choice(agent_names)
        page2_lines.extend([
            "AGENT INFORMATION",
            f"Agent: {agent_name}",
            f"License: {random.choice(['AG', 'IN', 'LI'])}{random.randint(100000,999999)}",
            f"Phone: ({random.randint(200,999)}) {random.randint(200,999)}-{random.randint(1000,9999)}",
            f"Email: {agent_name.lower().replace(' ', '.')}@{carrier.lower().replace(' ', '').replace('&', '')}insurance.com",
        ])
        
        # Generate the PDF with multiple pages
        fpath = os.path.join(pdf_dir, f"{holder['last_name']}_{holder['first_name']}_HOME_{pol_id}.pdf".replace(" ",""))
        with PdfPages(fpath) as pdf:
            # Page 1: Main declarations
            page(pdf, f"{carrier} | Homeowners Policy Declarations", page1_lines)
            
            # Page 2: Premium breakdown and forms
            page(pdf, f"{carrier} | Premium Breakdown & Forms Schedule", page2_lines)
            
            # Page 3+: Endorsement details (if any endorsements exist)
            if endorsement_content:
                page(pdf, f"{carrier} | Endorsement Details", endorsement_content)

        policies.append(policy_row)
        policy_pdfs.append(fpath)
        manifest_rows.append({
            **policy_row,
            "coverage_a": A, "coverage_b": B, "coverage_c": C, "coverage_d": D,
            "liability_limit": liab, "med_pay_limit": med,
            "endorsements": "; ".join(endorsements),
            "property_address": f"{address}, {city}, {st['code']} {zipc}",
            "year_built": year_built, "roof_type": roof_type, "construction_type": construction,
            "square_feet": square_feet, "stories": stories
        })

# Save CSVs and JSON
holders_csv = os.path.join(out_root, "policyholders.csv")
policies_csv = os.path.join(out_root, "policies.csv")
manifest_csv = os.path.join(out_root, "policy_manifest.csv")
manifest_json = os.path.join(out_root, "policy_manifest.json")
pd.DataFrame(holders).to_csv(holders_csv, index=False)
pd.DataFrame(policies).to_csv(policies_csv, index=False)
pd.DataFrame(manifest_rows).to_csv(manifest_csv, index=False)
with open(manifest_json, "w") as f:
    json.dump(manifest_rows, f, indent=2)

# Zip bundle for download
zip_path = "home_insurance_dataset_fast.zip"
with ZipFile(zip_path, "w", ZIP_DEFLATED) as zf:
    zf.write(holders_csv, arcname="policyholders.csv")
    zf.write(policies_csv, arcname="policies.csv")
    zf.write(manifest_csv, arcname="policy_manifest.csv")
    zf.write(manifest_json, arcname="policy_manifest.json")
    for st in states:
        zf.write(booklets[st["code"]], arcname=f"pdf/Booklet_{st['code']}.pdf")
    for p in policy_pdfs:
        zf.write(p, arcname=f"pdf/{os.path.basename(p)}")

{"zip": zip_path, "num_policies": len(policy_pdfs), "sample": policy_pdfs[:6]}
