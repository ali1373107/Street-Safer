import { StyleSheet, Text, View, Button, ScrollView } from "react-native";

function Privacy(props) {
  console.log(props);
  return (
    <ScrollView contentContainerStyle={styles.viewStyle}>
      <Text style={styles.headingStyle}>Privacy and Policy </Text>
      <Text style={styles.privacyNotice}>
        Privacy Notice {"\n\n"}
        Introduction: your privacy {"\n"}
        Street Saver is committed to protecting your privacy when you use our
        services. {"\n\n"}
        The Privacy Notice below explains how we use information about you and
        how we protect your privacy. {"\n\n"}
        To the right of this webpage you will see a linked list of services we
        provide. Under each service is more information about who we may share
        your information with and why. {"\n\n"}
        We have a Data Protection Officer who makes sure we respect your rights
        and follow the law. {"\n\n"}
        We are registered as a Data Controller with the Information
        Commissioner's Office and our registration number is Z5267246. The
        Information Commissioner's Office Public Register entry for the council
        can be viewed here. {"\n\n"}
        If you have any concerns or questions about how we look after your
        personal information, contact the Council’s Data Protection Officer, at
        DataProtection@streetSaver.gov.uk or by calling 01234567890 and asking
        to speak to the Data Protection Officer.
      </Text>
      <Button
        title="Notification"
        onPress={() =>
          props.navigation.navigate("Notification", {
            name: "Notification",
          })
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: 10,
  },
  textStyle: {
    fontSize: 28,
    color: "black",
  },
  headingStyle: {
    fontSize: 30,
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  privacyNotice: {
    fontSize: 16,
    color: "black",
    marginBottom: 20,
  },
});

export default Privacy;
