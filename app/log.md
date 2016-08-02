# 16.7.29
1.fixed: when I remove an empty group in the right pane, it will cause an exception error.
2.add several css styles to the right pane.
3.fixed: remove a group with members,and then the flyOut can reflect it.
4.add and show the amount of each group's member(half done)
5.TODO:to change the store mode of localStorage, maybe to remove it.

#16.8.1
1.fixed:show employee in model group immediately when I click to add it. 
2.Done:(16.7.29,4).
3.add:when adding a employee to model group,it can broadcast from leftPane to rightPane.
4.add:use a random color to mark a group
5.add:when adding a employee to a model group,the marked color will show on the avatar.(not use localStorage,to be modified)
6.TODO:the error vm.show_name's duplicate value ,to check the value.(pending,to use a regular expression)

#16.8.2
1.fixed: when remove an employee from a model group , the wrong display of the amount of the model group members.
2.fixed: when assign an employee to a model group, broadcast an object insteadof a value.
3.add: displaying other information of an employee in the model group.
4.other: refactor the position of fly-out cards.
5.TODO: assign planner to model group and refactor codes.