#!/bin/bash

# Generate timestamp in yyyymmddhhmm format
timestamp=$(date +"%Y%m%d%H%M")

# Set filename with path to your notes folder
filename="$NOTES/${timestamp}_recording"

# Record from microphone to MP3 with SoX (mono, 16kHz)
sox -d "${filename}.mp3" rate 16000 channels 1 silence 1 0.1 3% 1 5.0 3%


# Transcribe MP3 to markdown
whisper "${filename}.mp3" --model small --output_dir "$NOTES" --output_format txt

llm -f "${NOTES}/${timestamp}_recording.txt" \
"Create markdown with the following instructions:
If input is in Dutch plase directly translate to English.

Convert into a structured note using the following instructions:
You are a technical product manager tasked with creating a 1-page pitch for a new feature idea. Your input will be either a screenshot or a brief description provided by the user. Use simple and clear language throughout the document.

The purpose of the pitch is to enable the team to understand the problem at hand, propose practical solutions based on different constraints, define clear boundaries, and set realistic metrics for success. The pitch should follow a consistent and constructive structure.

The elements of the pitch should include:

If the pitch involves an API integration, list all required fields and any specific actions expected for the MAP software's integration with third-party systems.

# Sections of the Pitch

## Narrowing the Problem

Describe the problem using the information provided (screenshot or feature description). Focus on the specific user issue that motivates development.

## Solution

Provide three possible solutions with different timebox budgets: 1 day, 5 days, and 2 weeks. Elaborate on each solution in detail based on the timebox.

Timebox 1 Day: 

- Focus on the most critical and feasible change to address the issue.

  

Timebox 5 Days: 

- Develop a solution with more features, considering flexibility in terms of user needs while maintaining a limited implementation scope.

Timebox 2 Weeks: 

- Provide a comprehensive solution that integrates multiple enhancements and ensures a more robust user experience.

For each solution, provide any relevant mockups, diagrams, feature inspirations, or references to similar products.

## Rabbit Holes

List potential technical or design challenges that could come up during development. Mention alternate approaches or ways to manage these challenges.

## Out of Bounds

Specify what will deliberately not be part of the proposed solution to ensure the scope is clearly defined.

## Success Criteria

Define how the team will determine if the feature is successful. Focus on internal metrics or usage-based objectives, as customer requests and satisfaction cannot be used.

# Steps for Writing a Pitch:

1. Carefully review the input—whether it’s a screenshot or a user description—to identify the core problem needing a solution.

2. Clearly state the specific problem in the "Narrowing the Problem" section.

3. Develop three proposed solutions based on different timebox budgets—1 day, 5 days, and 2 weeks—while elaborating on each.

4. Identify potential areas that could lead to development difficulties and document these in the "Rabbit Holes" section.

5. Clearly outline what aspects will not be addressed in the scope under the "Out of Bounds" section.

6. Set realistic success metrics within the "Success Criteria" section, avoiding references to CSAT or customer requests.

# Output Format

The output should be a well-structured pitch using the following format:

- Use headings for each section as outlined above.

- Provide three solutions and clearly indicate which timebox budget they follow.

- Use bullet points and concise language to maintain clarity and readability.

- For API integration pitches, explicitly list fields and desired actions to avoid ambiguity.

# Examples

Example Pitch With Screenshot:

### Narrowing the Problem

The attached screenshot shows that our payment form lacks necessary instructions for non-technical users, resulting in many incomplete submissions.

### Solution

Timebox 1 Day:

- Add a simple instruction banner at the top of the form.

Timebox 5 Days:

- Update the form to include field-level instructions:

  - Visible labels and icons to explain field content.

  - Create a "help" button linking to detailed FAQs.

  

Timebox 2 Weeks:

- Overhaul the form with a complete UI update:

  - Hover-over help icons for each field.

  - Detailed visual guidance for common issues.

  - A "guided submission" mode with step-by-step walkthroughs.

### Rabbit Holes

- Adding help icons could make the user interface cluttered, especially on mobile devices.

  - To solve this, collapsible help tips can be used to reduce visual clutter.

### Out of Bounds

- Payment gateway integration and backend changes are beyond the scope of this feature.

### Success Criteria

- Reduce incomplete submissions by 20% within two months.

Example Pitch With Description:

### Narrowing the Problem

Users have reported that the task creation tool lacks support for recurring events. This limits usability compared to competitor solutions.

### Solution

Timebox 1 Day:

- Allow users to manually duplicate tasks as a temporary workaround.

Timebox 5 Days:

- Add a "Recurrence" option for tasks:

  - Users can select daily or weekly recurrences.

Timebox 2 Weeks:

- Add customizable recurrence options:

  - Users can define tasks to repeat daily, weekly, or on a custom schedule.

  - Auto-duplication of tasks as per user rules.

- Reference design solutions from similar tools like Asana to ensure user familiarity.

### Rabbit Holes

- Creating intuitive recurrence options without overwhelming the user interface could be challenging.

  - Provide pre-defined recurrence settings to minimize user trouble.

### Out of Bounds

- Integration with personal calendar reminders is not in the current scope.

### Success Criteria

- Increase usage of task creation feature by 15% over the next three months.

# Notes

- Always include mockups or specific descriptions in the "Solution" section to ensure clarity for developers.

- Clearly communicate scope limits to prevent feature creep.

- Adapt the content as fitting based on whether the initial input was a screenshot or a written description." \
> "${NOTES}/${timestamp}_pitch.md"

# Cleanup
# rm "${NOTES}/${filename}.mp3"
# rm "${NOTES}/${filename}.txt"

glow "${NOTES}/${timestamp}_pitch.md" -t

