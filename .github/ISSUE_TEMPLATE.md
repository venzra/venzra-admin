### REQUIREMENT

Describe the requirement in a simple format ensuring that the following areas are being considered.

**I** ndependent  
**N** egotiable  
**V** aluable  
**E** stimable  
**S** mall  
**T** estable

*Tip: Consider story format `As a (user or system) I want to (perform an interaction) So that (there is a value)` for requirements.*

*Warning: Always check that the issue does not already exist under a similar heading or future plan.*

### DEFECT

Describe the steps performed to identify the reported defect.

- Expected behaviour
- Actual behaviour

*Warning: Ensure there is a requirement that this defect is part of, else this may be a new requirement.*

### CRITERIA

Describe the expected behaviour of the requirement.

```gherkin
Scenario: Determinable system of business situation
  Given there is/are some precondition(s)
  When there are some user actions performed by an actor
  Then a testable outcome is achieved
```

*Note: In most situations there should only be one criteria for an issue.*

### ASSUMPTIONS

- Any considerations made that are not expected to be carried out at this time
- Dependencies on research or existing issues

### PROPOSALS

- Annotated wireframe
- Flow charts
- Data models
- Interim work around

### TASKS

- [ ] Fidelity tasks to complete requirement
- [ ] Updates to documentation
- [ ] Special areas of interest for testing
