# Diátaxis Documentation Framework: Complete Guide

## What is Diátaxis?

Diátaxis is a systematic framework for organizing technical documentation around user needs[1]. Created by Daniele Procida, it divides documentation into four distinct types, each serving a specific purpose and audience[1][2].

The name comes from Ancient Greek, meaning "across arrangement"[3]. Rather than organizing docs around product features, Diátaxis focuses on what users actually need when they consult documentation[9].

---

## The Four Documentation Types

### **Tutorials** (Learning-Oriented)

**Purpose**: Help beginners acquire skills through hands-on practice[1][14]

**What it is**: A learning experience where students follow step-by-step instructions to complete a meaningful project[14]. Think of it as a cooking lesson with a child—what they produce matters less than what they learn[14].

**Key characteristics**:
- Practical activities with concrete steps
- Designed for skill acquisition, not getting work done
- Teacher takes full responsibility for student success
- Delivers visible results early and often
- Focuses on the concrete, ignoring alternatives[14]

**Example**: "Let's create a simple game in Python"[1]

**Language to use**: 
- "We will..."
- "First, do x. Now, do y."
- "Notice that..."
- "The output should look like..."[14]

---

### **How-To Guides** (Goal-Oriented)

**Purpose**: Help competent users solve specific real-world problems[2][34]

**What it is**: Practical directions that guide someone through a problem toward a result[2]. Like a recipe—it assumes basic competence and focuses purely on achieving the goal[2].

**Key characteristics**:
- Addresses specific tasks or problems
- Assumes user knows what they want
- Maintains focus on the goal
- Provides executable solutions
- Seeks flow in the user's workflow[2][34]

**Example**: "How to configure frame profiling" or "How to calibrate the radar array"[2]

**Language to use**:
- "This guide shows you how to..."
- "If you want x, do y"
- "To achieve w, do z"
- "Refer to the x reference guide for more"[2]

---

### **Reference** (Information-Oriented)

**Purpose**: Provide technical descriptions users can consult while working[19][21]

**What it is**: Austere, factual descriptions of the machinery and how it operates[19]. Like a map—it tells you what you need to know about the territory without exploring it yourself[19].

**Key characteristics**:
- Neutral description only
- Consistent patterns and structure
- Mirrors the product's architecture
- Contains facts, commands, options, warnings
- Meant to be consulted, not read cover-to-cover[19]

**Example**: API documentation, class references, configuration options[1][6]

**Language to use**:
- State facts about the machinery
- List commands, options, features, limitations
- "You must use a. You must not apply b unless c"[19]

---

### **Explanation** (Understanding-Oriented)

**Purpose**: Deepen understanding through discussion and context[29]

**What it is**: Discursive treatment that permits reflection, providing the "why" behind things[29]. Like a book on food history—you read it away from the kitchen to change how you think about cooking[29].

**Key characteristics**:
- Provides background, context, design decisions
- Makes connections between concepts
- Can include opinions and perspectives
- Explores alternatives and trade-offs
- Not tied to immediate action[29]

**Example**: "About database connection policies" or "Why we use HTTPS encryption"[2][29]

**Language to use**:
- "The reason for x is because historically, y..."
- "W is better than z, because..."
- "Some users prefer w. This can be a good approach, but..."[29]

---

## The Diátaxis Map

The framework organizes these four types along two axes[1][9][19]:

**Horizontal axis**: Acquisition (study) → Application (work)
**Vertical axis**: Action (doing) → Cognition (knowing)

```
                ACQUISITION ← → APPLICATION
                   (Study)         (Work)
                      
    ACTION     ┌──────────┬──────────┐
   (Doing)     │ TUTORIAL │ HOW-TO   │
               │          │  GUIDE   │
               ├──────────┼──────────┤
  COGNITION    │EXPLANATION│REFERENCE│
  (Knowing)    │          │          │
               └──────────┴──────────┘
```

This map shows relationships and boundaries. **Crossing these boundaries creates documentation problems**[1][19].

---

## Why Use Diátaxis?

### **For Users**
- Find exactly what they need when they need it[2][8]
- No confusion from mixed content types[27]
- Clear navigation and expectations[6]

### **For Creators**
- Clear direction on what to write and how[23][24]
- Removes the "blank page" problem[15]
- Makes maintenance easier[4][9]
- Supports iterative improvement[22][29]

### **For Organizations**
- Higher user retention and satisfaction[24]
- Reduced support costs[28]
- Better SEO and searchability[24]
- Works with agile and distributed teams[24]

---

## Implementation Guide for Technical Documentation

### **Phase 1: Audit Current Documentation**

**Step 1**: Create an inventory
- List all existing documentation pages/files
- Note what each piece covers
- Don't evaluate quality yet—just catalog[23][24]

**Step 2**: Identify current problems
Common issues to look for:
- Tutorials mixed with how-to guides[4][27]
- Explanation buried in reference material[25]
- Unclear structure or navigation[4]
- Lengthy topics cramming multiple content types together[4]

---

### **Phase 2: Map Content to Categories**

**Step 1**: Classify each piece using the Diátaxis compass[1][19]

Ask two questions:
1. Does it inform **action** or **cognition**?
2. Does it serve **acquisition** or **application** of skill?

| Content informs... | Serves user's... | Category |
|-------------------|------------------|----------|
| Action | Acquisition | Tutorial |
| Action | Application | How-to guide |
| Cognition | Application | Reference |
| Cognition | Acquisition | Explanation |

**Step 2**: Mark content that spans multiple categories
These need to be split later[4][23]

**Step 3**: Identify gaps
Look for missing content types—especially tutorials and explanations, which are often neglected[13][25]

---

### **Phase 3: Restructure Content**

**Important**: Don't try to restructure everything at once[22][27][29]

**The Diátaxis workflow**[1][29][36]:
1. Choose any piece of documentation (even at random)
2. Assess it critically against Diátaxis standards
3. Decide on ONE improvement you can make right now
4. Make that improvement
5. Repeat

**Why this works**: Diátaxis changes structure from the inside out[22]. Small improvements accumulate. Eventually, the content itself will demand reorganization into proper categories[22].

**Breaking up mixed content**:

Example: A "Getting Started" guide mixing concepts and steps[23]

Before:
```
Getting Started with Widget API
- What is Widget API (explanation)
- How Widget API works (explanation)
- Install Widget API (tutorial)
- Configure authentication (how-to)
- API endpoint reference (reference)
```

After:
```
Tutorial: Your first Widget API project
How-to: Configure Widget API authentication
Reference: Widget API endpoints
Explanation: Widget API architecture
```

---

### **Phase 4: Create Navigation Structure**

**Only do this when the content demands it**[22]

Top-level structure:
```
Documentation/
├── Tutorials/
├── How-to Guides/
├── Reference/
└── Explanation/
```

**Tips**:
- Use these exact category names—they're recognized by users[15]
- Don't force content into categories that don't fit yet
- Let organic growth happen[2][22]
- Some projects won't need all four types[5]

---

### **Phase 5: Write New Content**

For each new documentation task, determine the type first[4][27].

#### **Writing Tutorials**

**Do**:
- Show learners what they'll build upfront[14]
- Provide concrete, numbered steps
- Keep explanation minimal—link to explanation docs instead[14]
- Use "we" language to create partnership[14]
- Deliver frequent, visible results[14]
- Point out what learners should notice[14]
- Test extensively for reliability[14]

**Don't**:
- Try to teach by explaining[14]
- Offer multiple ways to do things[14]
- Assume prior knowledge
- Skip steps that seem obvious

**Example structure**:
```
# Tutorial: Build a Contact Form

In this tutorial, we'll create a working contact form 
with validation and email notifications.

## What you'll build
[Show finished example]

## Step 1: Set up the HTML structure
First, create a new file called contact.html...
[Provide exact code]

You should see: [Show expected output]

## Step 2: Add form validation
Now we'll add client-side validation...
```

---

#### **Writing How-To Guides**

**Do**:
- Focus relentlessly on the goal[2][34]
- Address real problems users actually have
- Assume competence[2]
- Provide a logical sequence of actions[2]
- Make guides adaptable to real-world use[2]
- Omit unnecessary background[2]

**Don't**:
- Explain concepts (link to explanations instead)[2]
- Provide exhaustive reference information
- Start from absolute basics

**Example structure**:
```
# How to Enable Two-Factor Authentication

This guide shows you how to add 2FA to user accounts.

Prerequisites: Admin access, SMTP configured

## Steps

1. Navigate to Settings > Security
2. Enable "Require 2FA" toggle
3. Configure backup codes:
   - Set expiry period
   - Define recovery options
4. Test with a non-admin account

See: [Security best practices (explanation)]
See: [Authentication API reference]
```

---

#### **Writing Reference**

**Do**:
- Describe facts neutrally[19]
- Use consistent patterns and formatting[19]
- Mirror the product's structure[19]
- Include examples for clarity[19]
- Provide warnings where needed[19]

**Don't**:
- Include opinions or recommendations
- Explain why things are designed this way
- Provide instructions (that's how-to guides)

**Example structure**:
```
# authenticate() function

## Syntax
authenticate(username, password, method='basic')

## Parameters
- username (string, required): User identifier
- password (string, required): User password  
- method (string, optional): Authentication method.
  Defaults to 'basic'. Options: 'basic', 'oauth', 'token'

## Returns
AuthToken object on success, None on failure

## Example
token = authenticate('user@example.com', 'pass123', 'oauth')

## Warnings
- Passwords are not validated client-side
- Failed attempts are logged
```

---

#### **Writing Explanation**

**Do**:
- Provide context and background[29]
- Make connections between concepts[29]
- Discuss the "why" behind decisions[29]
- Consider alternative approaches[29]
- Include opinions (when clearly labeled)[29]
- Circle around the subject from different angles[29]

**Don't**:
- Provide instructions
- List technical specifications
- Focus on immediate application

**Example structure**:
```
# About Authentication Methods

Our platform supports three authentication methods, each 
designed for different security contexts.

## Why multiple methods?

Basic authentication was our original approach, but we added 
OAuth and token-based auth as our user base grew...

## When to use each method

Basic auth works well for internal tools where...
OAuth is better suited for third-party integrations because...
Token-based auth offers advantages when...

## Trade-offs

Each method involves compromises:
- Basic auth is simple but less secure for public APIs
- OAuth adds complexity but provides better user experience...

## Historical context

We initially resisted OAuth because [explain reasoning]...
```

---

### **Phase 6: Maintain and Iterate**

**Ongoing practices**:

**Regular reviews**[24]:
- Check for content drift (reference becoming how-to, etc.)
- Update examples and code samples
- Address user feedback

**Gather feedback**[24]:
- Monitor which pages users visit most
- Track support questions to identify gaps
- Survey users about documentation usefulness

**Handle product changes**[14]:
- Tutorials require the most revision when products evolve
- How-to guides and reference need updates for new features
- Explanations remain most stable

**Keep improving one step at a time**[22][27][36]:
- Never stop the iterative improvement cycle
- Each small change reveals the next improvement
- Don't pursue perfection—pursue better

---

## Common Pitfalls to Avoid

### **1. Trying to restructure everything at once**[22][27]
**Problem**: Overwhelming, never gets finished
**Solution**: Improve one piece at a time

### **2. Mixing documentation types**[1][27]
**Problem**: Confuses all readers
**Solution**: Use the compass to check what you're writing

### **3. Overloading tutorials with explanation**[14]
**Problem**: Breaks the learning flow
**Solution**: Link to explanation docs instead

### **4. Writing reference as if it's how-to**[19]
**Problem**: Users can't find facts quickly
**Solution**: Keep reference austere and neutral

### **5. Neglecting explanation**[13][25]
**Problem**: Users don't develop deep understanding
**Solution**: Write "About..." pages for key concepts

### **6. Forcing content into wrong categories**[22]
**Problem**: Content feels unnatural
**Solution**: Let the content tell you where it belongs

---

## Real-World Examples

### **ClickHelp's Transformation**[4]
- Started with cluttered, inconsistent documentation
- Applied Diátaxis iteratively
- Let content create the structure
- Continues improving based on what's popular and what's missing

### **Sequin's Fix**[13]
- Previously led with "How it works" (explanation)
- Users didn't "get it" until hands-on
- Reorganized to start with tutorials
- Dramatically improved user comprehension

### **Canonical/Ubuntu**[25]
- Adopted Diátaxis across all documentation
- Security docs became: security reference, security how-tos, security explanations
- Users now know exactly where to find what they need

---

## Quick Start Checklist

For implementing Diátaxis today:

- [ ] Read the Diátaxis website start page (5 minutes)
- [ ] Choose ONE existing doc page
- [ ] Ask: What user need does this serve?
- [ ] Identify ONE improvement using Diátaxis principles
- [ ] Make that improvement
- [ ] Publish immediately
- [ ] Choose next page and repeat

**Remember**: You don't need to understand everything before starting[29]. Apply one idea, see what happens, learn from it, and apply the next idea[1][2].

---

## Resources

- **Official Diátaxis website**: https://diataxis.fr
- **Video presentation**: "Always complete, never finished" by Daniele Procida
- **Example implementation**: Canonical's documentation starter pack on GitHub[16]

---

## Key Takeaway

Diátaxis isn't about perfect structure—it's about **serving user needs**[1][3][8]. Start small, iterate constantly, and let better documentation emerge from continuous improvement[1][22][29].

The best documentation isn't built; it's grown[2][22].