# Ethical Hacking Project – Defense → Attack Flow

> **Module Context**: Ethical Hacking / Red Team–Blue Team Exercise
> **Team**: Team 15
> **Approach**: *Defense-first design, followed by controlled offensive testing*

---

## 📌 Project Overview

This repository documents a **full ethical hacking lifecycle** carried out as part of a controlled academic exercise.

Unlike a typical attack-only walkthrough, this project is intentionally designed to:

1. **Start with Defense** – building and hardening a realistic production-like server.
2. **Introduce a Deliberate Weakness** – allowing other teams to ethically attack.
3. **Execute an Attack** – performing a structured red-team assessment against another team’s server.

Everything is presented **as a flow**, mirroring how real-world security teams operate.

---

## 🛡️ PART 1 — DEFENSE (Blue Team Setup)

### 1.1 Objective

The goal of the defense phase was to deploy a **realistic web server** with layered security controls, while intentionally leaving **one exploitable vulnerability** for ethical attack exercises.

This server acts as:

* A hardened production-like environment
* A controlled target for red team validation

---

### 1.2 Server Architecture (High Level)

**Platform**: AWS EC2
**OS**: Ubuntu 24.04 LTS
**Services Exposed**:

| Service            | Port | Purpose                                    |
| ------------------ | ---- | ------------------------------------------ |
| HTTPS (Apache)     | 443  | Public company site                        |
| FTP                | 21   | Development artefacts (intentionally weak) |
| WordPress (Apache) | 8000 | E-commerce platform                        |
| SSH                | 22   | Administrative access                      |

---

### 1.3 Defensive Build Flow

#### Step 1 — Base System Setup

* Updated OS packages
* Installed Apache2, PHP, MySQL
* Created least-privilege service users

#### Step 2 — Company Website (Port 443)

* Static HTTPS landing page
* Company branding and metadata
* Public-facing information only

#### Step 3 — Social Engineering Surface

* Instagram business page created
* Username and password hints embedded in posts
* Used later as an **attack intelligence source**

> Purpose: Simulate real-world OSINT leakage

#### Step 4 — FTP Service (Intentional Weakness)

* FTP enabled with accessible development files
* Blog source code stored on FTP
* **Credential leakage** embedded in configuration file

> This is the **deliberate entry point** for attackers

---

### 1.4 WordPress & WooCommerce Stack

#### Configuration

* WordPress hosted on **port 8000**
* MySQL backend
* WooCommerce plugin installed

#### Deliberate Vulnerability

* Installed **Product XML Feeds for WooCommerce v2.9.3**
* Vulnerable to **Remote Code Execution**

**CVE**: `CVE-2025-49887`

> This vulnerability was intentionally preserved for red team exploitation.

---

### 1.5 Endpoint Detection & Response (EDR)

To prevent trivial exploitation:

* **Elastic Endpoint Security** deployed
* Rules set to **prevent**, not detect
* Blocks common reverse shells from `www-data`

> Attackers must bypass EDR using non-standard techniques

---

### 1.6 Privilege Escalation Design (Intentional)

A **custom password manager binary** was deployed with:

* Execute-only permissions
* Root-owned password database
* `sudo` misconfiguration allowing execution as root

This simulates:

* Insecure custom tooling
* Poor secret handling
* Misuse of SUID / sudo permissions

---

### 1.7 Defense Summary

✔ Hardened OS & services
✔ Firewall & access controls
✔ EDR protection enabled
✔ One realistic exploit chain preserved

This completes the **Blue Team phase**.


### 1.8 Attack Flow Summary
<img src="Defense/Attack%20Flow%20Diagram.png" height="50%" />

This completes the **Setting up the server**.

---

## ⚔️ PART 2 — ATTACK (Red Team Assessment)

### 2.1 Objective

For the attack phase, we were provided with **another team’s server IP address**.

Our task was to:

* Perform a full red team assessment
* Achieve initial access
* Escalate privileges
* Demonstrate impact

All actions were conducted **ethically and within scope**.

---

### 2.2 Attack Flow (High Level)

**Recon → Initial Access → Code Execution → EDR Bypass → Privilege Escalation → Root**

---

### 2.3 Reconnaissance

* Full port scan using `nmap`
* Service fingerprinting
* Web content discovery
* Version identification

Findings included:

* Apache default pages
* Directory listing exposure
* WordPress instances
* Credential reuse indicators

---

### 2.4 Initial Access

#### Vector 1 — Credential Reuse

* Database credentials obtained via SQL injection
* Same credentials reused for SSH access

#### Vector 2 — Web Exploitation

* Read-only SQL injection used to dump hashes
* Hashes cracked using GPU-assisted `hashcat`

Result:

* SSH access as low-privilege user

---

### 2.5 Remote Code Execution

* Identified vulnerable upload endpoint
* Uploaded PHP web shell
* Gained `www-data` access

---

### 2.6 EDR Bypass

Elastic Endpoint blocked:

* Standard bash reverse shells
* Common one-liners

Bypass technique:

* Python-based C2 channel
* Compiled C reverse shell
* Manual shell upgrade using `pty.spawn()`

---

### 2.7 Privilege Escalation

#### Discovery

* SUID / executable-only binaries found
* Custom password manager identified

#### Exploitation

* Dumped binary using `ExeOnlyDump`
* Extracted hardcoded encryption key via `strings`
* Decrypted password database

Result:

* Root credentials recovered
* **Root shell obtained**

---

### 2.8 Post-Exploitation

* Persistence options identified
* SSH keys added (demonstration only)
* Logs selectively cleaned
* System stability preserved

---

## 🔁 Defense ↔ Attack Relationship

This project intentionally demonstrates:

* How **defensive design influences attacker behaviour**
* Why attackers chain **small misconfigurations**
* How EDR changes exploitation strategy

Defense and attack are **two sides of the same system**.

---

## 🙏 Special Thanks

Special thanks to:

* **WordPress** — for providing a flexible and realistic CMS platform
* **WooCommerce** — for enabling real-world e-commerce attack surfaces

These tools made it possible to simulate **authentic enterprise scenarios**.

---

## 📜 License

This project is released under the **MIT License**.

It is intended **strictly for educational and ethical hacking purposes**.

Unauthorized use against systems you do not own or have permission to test is strictly prohibited.

---

## ⚠️ Disclaimer

This repository documents techniques used in a **controlled academic environment**.

Do **not** replicate these attacks outside of legal, ethical, and authorized contexts.

> *With great power comes great responsibility.*
