---
title: "Οδηγίες αιτήματος έλξης"
description: "Οδηγίες για την υποβολή αιτημάτων έλξης σε έργα XOOPS"
---

Αυτό το έγγραφο παρέχει ολοκληρωμένες οδηγίες για την υποβολή αιτημάτων έλξης σε έργα XOOPS. Η τήρηση αυτών των οδηγιών διασφαλίζει ομαλούς ελέγχους κώδικα και ταχύτερους χρόνους συγχώνευσης.

## Πριν δημιουργήσετε ένα αίτημα έλξης

## # Βήμα 1: Ελέγξτε για υπάρχοντα ζητήματα

```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```

## # Βήμα 2: Διαχωρίστε και κλωνοποιήστε το αποθετήριο

```bash
# Fork the repository on GitHub
# Click "Fork" button on the repository page

# Clone your fork
git clone https://github.com/YOUR_USERNAME/XOOPS.git
cd XOOPS

# Add upstream remote
git remote add upstream https://github.com/XOOPS/XOOPS.git

# Verify remotes
git remote -v
# Should show: origin (your fork) and upstream (official)
```

## # Βήμα 3: Δημιουργήστε έναν κλάδο λειτουργιών

```bash
# Update main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
# Use descriptive names: bugfix/issue-number or feature/description
git checkout -b bugfix/123-fix-database-connection
git checkout -b feature/add-psr-7-support
```

## # Βήμα 4: Κάντε τις αλλαγές σας

```bash
# Make changes to your files
# Follow code style guidelines

# Stage changes
git add .

# Commit with clear message
git commit -m "Fix database connection timeout issue"

# Create multiple commits for logical changes
git commit -m "Add connection retry logic"
git commit -m "Improve error messages for debugging"
```

## Πρότυπα δέσμευσης μηνυμάτων

## # Μηνύματα καλής δέσμευσης

Χρησιμοποιήστε σαφή, περιγραφικά μηνύματα ακολουθώντας αυτά τα μοτίβα:

```
# Format
<type>: <subject>

<body>

<footer>

# Example 1: Bug fix
fix: resolve database connection timeout

Add exponential backoff retry mechanism to database connection.
Connections now retry up to 3 times with increasing delays.

Fixes #123
```

```
# Example 2: Feature
feat: implement PSR-7 HTTP message interfaces

Implement Psr\Http\Message interfaces for request/response handling.
Provides type-safe HTTP message handling across the framework.

BREAKING CHANGE: Updated RequestHandler signature
```

## # Κατηγορίες τύπου δέσμευσης

| Τύπος | Περιγραφή | Παράδειγμα |
|------|-------------|---------|
| `feat ` | Νέα δυνατότητα | ` feat: add user dashboard widget` |
| `fix ` | Διόρθωση σφαλμάτων | ` fix: resolve cache invalidation bug` |
| `docs ` | Τεκμηρίωση | ` docs: update API reference` |
| `style ` | Στυλ κώδικα (χωρίς αλλαγή λογικής) | ` style: format imports` |
| `refactor ` | Ανακατασκευή κώδικα | ` refactor: simplify service layer` |
| `perf ` | Βελτίωση απόδοσης | ` perf: optimize database queries` |
| `test ` | Αλλαγές δοκιμής | ` test: add integration tests` |
| `chore ` | Build/tooling αλλαγές | ` chore: update dependencies` |

## Περιγραφή αιτήματος έλξης

## # Πρότυπο δημοσίων σχέσεων

```markdown
## Description
Clear description of changes made and why.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123
Related to #456

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] Added new tests
- [ ] Manual testing steps included

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Added tests for new functionality
- [ ] All tests passing
```

## Απαιτήσεις ποιότητας κώδικα

## # Στυλ κώδικα

Ακολουθήστε τις οδηγίες στυλ κώδικα:

```php
<?php
// Good: PSR-12 style
namespace MyModule\Controller;

use MyModule\Model\Item;
use MyModule\Repository\ItemRepository;

class ItemController
{
    private ItemRepository $repository;

    public function __construct(ItemRepository $repository)
    {
        $this->repository = $repository;
    }

    public function indexAction()
    {
        $items = $this->repository->findAll();
        return $this->render('items', ['items' => $items]);
    }
}
```

## Απαιτήσεις δοκιμής

## # Δοκιμές μονάδων

```php
// tests/Feature/DatabaseConnectionTest.php
namespace Tests\Feature;

use PHPUnit\Framework\TestCase;
use Xoops\Database\XoopsDatabase;

class DatabaseConnectionTest extends TestCase
{
    private XoopsDatabase $database;

    protected function setUp(): void
    {
        $this->database = new XoopsDatabase();
    }

    public function testConnectionWithValidCredentials()
    {
        $result = $this->database->connect();
        $this->assertTrue($result);
    }

    public function testConnectionWithInvalidCredentials()
    {
        $this->database->setCredentials('invalid', 'invalid');
        $result = $this->database->connect();
        $this->assertFalse($result);
    }
}
```

## # Τρέξιμο τεστ

```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```

## Εργασία με υποκαταστήματα

## # Διατήρηση του υποκαταστήματος ενημερωμένο

```bash
# Fetch latest from upstream
git fetch upstream

# Rebase on latest main
git rebase upstream/main

# Or merge if you prefer
git merge upstream/main

# Force push if rebased (warning: only on your branch!)
git push -f origin bugfix/123-fix-database-connection
```

## Δημιουργία του αιτήματος έλξης

## # Μορφή Τίτλου PR

```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```

## Διαδικασία αναθεώρησης κώδικα

## # Τι αναζητούν οι κριτικοί

1. **Ορθότητα**
   - Επιλύει ο κωδικός το αναφερόμενο πρόβλημα;
   - Γίνονται χειρισμοί ακραίων περιπτώσεων;
   - Είναι κατάλληλος ο χειρισμός σφαλμάτων;

2. **Ποιότητα**
   - Ακολουθεί πρότυπα κωδικοποίησης;
   - Είναι διατηρήσιμο;
   - Είναι καλά δοκιμασμένο;

3. **Απόδοση**
   - Υπάρχουν παλινδρομήσεις απόδοσης;
   - Είναι βελτιστοποιημένα τα ερωτήματα;
   - Είναι λογική η χρήση μνήμης;

4. **Ασφάλεια**
   - Επικύρωση εισόδου;
   - SQL πρόληψη ένεσης;
   - Authentication/authorization;

## # Απάντηση στα σχόλια

```bash
# Address feedback
# Edit files based on review comments

# Commit changes
git commit -m "Address code review feedback

- Add additional error handling
- Improve test coverage for edge cases
- Update documentation"

# Push changes
git push origin bugfix/123-fix-database-connection
```

## Κοινά ζητήματα και λύσεις δημοσίων σχέσεων

## # Θέμα 1: Το PR είναι πολύ μεγάλο

**Πρόβλημα:** Οι αναθεωρητές δεν μπορούν να ελέγξουν αποτελεσματικά τις μαζικές PR

**Λύση:** Σπάστε σε μικρότερα PR
- Πρώτο PR: Βασικές αλλαγές
- Δεύτερο PR: Δοκιμές
- Τρίτο PR: Τεκμηρίωση

## # Θέμα 2: Δεν περιλαμβάνονται τεστ

**Πρόβλημα:** Οι αναθεωρητές δεν μπορούν να επαληθεύσουν τη λειτουργικότητα

**Λύση: ** Προσθέστε ολοκληρωμένες δοκιμές πριν από την υποβολή

## # Θέμα 3: Συγκρούσεις με το Main

**Πρόβλημα:** Το υποκατάστημά σας δεν είναι συγχρονισμένο με το κύριο

**Λύση:** Επαναφορά στο πιο πρόσφατο main

```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```

## Μετά τη συγχώνευση

## # Καθαρισμός

```bash
# Switch to main
git checkout main

# Update main
git pull upstream main

# Delete local branch
git branch -d bugfix/123-fix-database-connection

# Delete remote branch
git push origin --delete bugfix/123-fix-database-connection
```

## Σύνοψη βέλτιστων πρακτικών

## # Κάνετε

- Δημιουργήστε περιγραφικά μηνύματα δέσμευσης
- Κάντε εστιασμένες, μονοσκοπικές δημόσιες σχέσεις
- Συμπεριλάβετε δοκιμές για νέα λειτουργικότητα
- Ενημέρωση τεκμηρίωσης
- Αναφορά σε θέματα
- Διατηρήστε σαφείς τις περιγραφές δημοσίων σχέσεων
- Απαντήστε αμέσως σε κριτικές

## # Όχι

- Συμπεριλάβετε άσχετες αλλαγές
- Συγχώνευση main στο υποκατάστημά σας (χρησιμοποιήστε rebase)
- Αναγκαστική ώθηση μετά την έναρξη της αναθεώρησης
- Παράλειψη δοκιμών
- Υποβολή εργασιών σε εξέλιξη
- Αγνοήστε τα σχόλια αναθεώρησης κώδικα

## Σχετική τεκμηρίωση

- ../Συμβολή - Επισκόπηση συνεισφοράς
- Code-Style - Οδηγίες στυλ κώδικα
- ../../03-Module-Development/Best-Practices/Testing - Δοκιμές βέλτιστων πρακτικών
- ../Architecture-Decisions/ADR-Index - Αρχιτεκτονικές κατευθυντήριες γραμμές

## Πόροι

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Pull Request Help](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [Συμβατικές δεσμεύσεις](https://www.conventionalcommits.org/)
- [XOOPS Οργανισμός GitHub](https://github.com/XOOPS)

---

**Τελευταία ενημέρωση: ** 31-01-2026
**Ισχύει για:** Όλα τα έργα XOOPS
**Αποθετήριο:** https://github.com/XOOPS/XOOPS
