Feature: Ecommerce validations
  @Validation
  Scenario: Placing the order
    Given a login to Ecommerce2 application with "descript.linking@gmail.com" and "Lindy123$"
    Then Verify Error message is displayed