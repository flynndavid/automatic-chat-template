
# Objective

Create a rich, synthetic home insurance corpus that looks and reads like real carrier output so you can load it into Supabase and build an AI agent that answers policyholder questions with grounded, document backed responses.

# End goal

* A relational dataset with realistic policyholder accounts and policies.
* A library of long, state specific booklets the agent can cite for terms and conditions.
* Multi page, house specific Declarations packets that vary meaningfully across customers.
* Clean linkage so the agent can retrieve by account, policy, property, coverage, or state booklet.

# Scope we aligned on

* Focus on Homeowners only for now.
* 3 states for variety: TN, TX, CA.
* 10 unique home policies per state.
* 30 total policy PDFs, each tied to exactly one of the 3 state booklets.

# Outputs and file requirements

## 1) Policy PDFs (one per policy, multi page)

Purpose: the personalized artifact your agent will cite most.

Must include:

* Header: carrier, policy number, state, policy period, named insured.
* Mailing info and residence premises address.
* Coverages and limits:

  * Coverage A to D.
  * Section II liability and med pay.
* Deductibles:

  * Flat dollar or percent wind hail. TX should skew to percent options.
* Property and rating detail:

  * Year built, square feet, stories, construction type, roof type, protection class, distance to hydrant and fire station, prior losses count, security system flag.
* Premium view:

  * Annual premium plus a small breakdown line itemization for base, endorsements, taxes, fees.
* Forms and endorsements schedule:

  * A short list like HO 00 03, HO 04 90, plus selected endorsements.
* Endorsement pages:

  * 1 to 3 pages of readable narrative stubs for the applied endorsements.
* Special limits and notices:

  * Typical personal property special limits summary.
* Mortgagee section when present.
* Agent of record line.
* Clear “Synthetic sample for demo use only” footer.

Length target:

* 2 to 3 pages minimum per policy.

File naming:

* `pdf/<Last_First>_HOME_<PolicyId>.pdf`
  Example: `pdf/Evans_Casey_HOME_PTN001.pdf`

## 2) State policy booklets (one per state, long form)

Purpose: common, reusable policy terms the agent can reference.

Must include:

* Table of contents.
* Sections:

  * Agreement, Definitions, Policy Territory.
  * Section I coverages, perils insured against, exclusions, conditions.
  * Section II liability coverages, exclusions, conditions.
  * General conditions, duties after loss, appraisal, loss settlement, loss payment, suit against us, subrogation, cancellation, nonrenewal, assignment, inflation guard, special limits.
* State notices:

  * CA: wildfire advisory. Optional earthquake by endorsement.
  * TX: percent wind hail deductible and TDI consumer rights note.
  * TN: state driven settlement and nonrenewal notes.

Length target:

* 40 plus pages per booklet.

File naming:

* `pdf/Booklet_TN.pdf`, `pdf/Booklet_TX.pdf`, `pdf/Booklet_CA.pdf`

Relationship:

* Policies link to a booklet by `state_code`.

## 3) CSVs for Supabase

### policyholders.csv

One row per account holder.

Required fields:

* holder\_id (PK)
* first\_name, last\_name
* date\_of\_birth
* email, phone
* mailing\_address, mailing\_city, mailing\_state, mailing\_zip

### policies.csv

One row per policy.

Required fields:

* policy\_id (PK)
* holder\_id (FK to policyholders)
* state\_code, state
* carrier
* effective\_date, expiration\_date
* coverage\_form (HO-3)
* status
* annual\_premium
* deductible\_type (flat or percent\_wind\_hail)
* deductible\_value (number: dollars or proportion)
* has\_mortgagee, mortgagee\_name, mortgagee\_loan\_no

### policy\_manifest.csv

One row per policy with property specifics and coverage detail.

Required fields:

* policy\_id (PK or FK to policies)
* property\_address, city, state\_code, zip
* year\_built, square\_feet, stories
* construction\_type, roof\_type, occupancy\_type
* has\_security\_system, distance\_to\_fire\_station\_miles
* coverage\_a, coverage\_b, coverage\_c, coverage\_d
* liability\_limit, med\_pay\_limit
* endorsements (string list)
* optional rating fields:

  * protection\_class, distance\_to\_hydrant\_miles, prior\_losses\_3yr, discounts\_json

Optional mirror:

* policy\_manifest.json for non SQL consumers.

## 4) Packaging

* A single ZIP that contains:

  * `policyholders.csv`, `policies.csv`, `policy_manifest.csv`, optional `policy_manifest.json`
  * `pdf/Booklet_TN.pdf`, `pdf/Booklet_TX.pdf`, `pdf/Booklet_CA.pdf`
  * 30 policy PDFs in `pdf/`

# Realism and variability rules

* Coverage A ranges from 150k to 1.2M. B at 10 percent of A. C at 50 to 70 percent of A. D at 20 to 30 percent of A.
* Liability limit options: 100k, 300k, 500k.
* Med pay options: 1k, 5k, 10k.
* Deductibles:

  * TX uses percent wind hail for many policies.
  * Older roofs push higher flat deductibles or Roof ACV endorsement.
* Endorsements pool with state flavor:

  * Water Backup, Service Line, Ordinance or Law 10 or 25 percent, ID Theft, Equipment Breakdown, Roof ACV, Animal Liability sublimit.
  * Old homes are more likely to include Ordinance or Law.
* Mortgagee present on about 70 percent of policies.
* Discounts:

  * Alarm, New Roof, Claim Free, Bundle flags. Affect premium mod slightly.

# Data model and joins

* One to many: policyholders to policies.
* One to one: policies to policy\_manifest.
* Many to one: policies to state booklets by state\_code.

Suggested table keys and indexes:

* Primary keys on holder\_id and policy\_id.
* Indexes on state\_code, last\_name, email, property\_address for retrieval.

# How the agent will use this

* Authenticate user or agent. Look up `holder_id`.
* Retrieve policies by `holder_id`.
* Retrieve the property and coverage detail from `policy_manifest` for the named policy.
* Use `state_code` to fetch the correct booklet and quote definitions or exclusions.
* Answer questions with both structured fields and cited booklet sections.

# Acceptance checklist

* 3 long booklets at 40 plus pages each.
* 30 policy PDFs at 2 plus pages each with the required sections listed above.
* CSVs validate and import cleanly. All foreign keys resolve.
* Policy to booklet mapping verified by state\_code.
* Clear synthetic disclaimer on all PDFs.

# Future ready

* Add Auto or second homes by appending to `policies` and `policy_manifest`, reusing `policyholders`.
* If you later want combined packets, we can export per policy PDFs that append the full booklet after the declarations and endorsements. This keeps both retrieval patterns available.

