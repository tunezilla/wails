//go:build darwin

#ifndef _events_h
#define _events_h

extern void processApplicationEvent(unsigned int);
extern void processWindowEvent(unsigned int, unsigned int);

#define EventApplicationDidBecomeActive 1024
#define EventApplicationDidChangeBackingProperties 1025
#define EventApplicationDidChangeEffectiveAppearance 1026
#define EventApplicationDidChangeIcon 1027
#define EventApplicationDidChangeOcclusionState 1028
#define EventApplicationDidChangeScreenParameters 1029
#define EventApplicationDidChangeStatusBarFrame 1030
#define EventApplicationDidChangeStatusBarOrientation 1031
#define EventApplicationDidFinishLaunching 1032
#define EventApplicationDidHide 1033
#define EventApplicationDidResignActive 1034
#define EventApplicationDidUnhide 1035
#define EventApplicationDidUpdate 1036
#define EventApplicationWillBecomeActive 1037
#define EventApplicationWillFinishLaunching 1038
#define EventApplicationWillHide 1039
#define EventApplicationWillResignActive 1040
#define EventApplicationWillTerminate 1041
#define EventApplicationWillUnhide 1042
#define EventApplicationWillUpdate 1043
#define EventWindowDidBecomeKey 1044
#define EventWindowDidBecomeMain 1045
#define EventWindowDidBeginSheet 1046
#define EventWindowDidChangeAlpha 1047
#define EventWindowDidChangeBackingLocation 1048
#define EventWindowDidChangeBackingProperties 1049
#define EventWindowDidChangeCollectionBehavior 1050
#define EventWindowDidChangeEffectiveAppearance 1051
#define EventWindowDidChangeOcclusionState 1052
#define EventWindowDidChangeOrderingMode 1053
#define EventWindowDidChangeScreen 1054
#define EventWindowDidChangeScreenParameters 1055
#define EventWindowDidChangeScreenProfile 1056
#define EventWindowDidChangeScreenSpace 1057
#define EventWindowDidChangeScreenSpaceProperties 1058
#define EventWindowDidChangeSharingType 1059
#define EventWindowDidChangeSpace 1060
#define EventWindowDidChangeSpaceOrderingMode 1061
#define EventWindowDidChangeTitle 1062
#define EventWindowDidChangeToolbar 1063
#define EventWindowDidChangeVisibility 1064
#define EventWindowDidDeminiaturize 1065
#define EventWindowDidEndSheet 1066
#define EventWindowDidEnterFullScreen 1067
#define EventWindowDidEnterVersionBrowser 1068
#define EventWindowDidExitFullScreen 1069
#define EventWindowDidExitVersionBrowser 1070
#define EventWindowDidExpose 1071
#define EventWindowDidFocus 1072
#define EventWindowDidMiniaturize 1073
#define EventWindowDidMove 1074
#define EventWindowDidOrderOffScreen 1075
#define EventWindowDidOrderOnScreen 1076
#define EventWindowDidResignKey 1077
#define EventWindowDidResignMain 1078
#define EventWindowDidResize 1079
#define EventWindowDidUnfocus 1080
#define EventWindowDidUpdate 1081
#define EventWindowDidUpdateAlpha 1082
#define EventWindowDidUpdateCollectionBehavior 1083
#define EventWindowDidUpdateCollectionProperties 1084
#define EventWindowDidUpdateShadow 1085
#define EventWindowDidUpdateTitle 1086
#define EventWindowDidUpdateToolbar 1087
#define EventWindowDidUpdateVisibility 1088
#define EventWindowWillBecomeKey 1089
#define EventWindowWillBecomeMain 1090
#define EventWindowWillBeginSheet 1091
#define EventWindowWillChangeOrderingMode 1092
#define EventWindowWillClose 1093
#define EventWindowWillDeminiaturize 1094
#define EventWindowWillEnterFullScreen 1095
#define EventWindowWillEnterVersionBrowser 1096
#define EventWindowWillExitFullScreen 1097
#define EventWindowWillExitVersionBrowser 1098
#define EventWindowWillFocus 1099
#define EventWindowWillMiniaturize 1100
#define EventWindowWillMove 1101
#define EventWindowWillOrderOffScreen 1102
#define EventWindowWillOrderOnScreen 1103
#define EventWindowWillResignMain 1104
#define EventWindowWillResize 1105
#define EventWindowWillUnfocus 1106
#define EventWindowWillUpdate 1107
#define EventWindowWillUpdateAlpha 1108
#define EventWindowWillUpdateCollectionBehavior 1109
#define EventWindowWillUpdateCollectionProperties 1110
#define EventWindowWillUpdateShadow 1111
#define EventWindowWillUpdateTitle 1112
#define EventWindowWillUpdateToolbar 1113
#define EventWindowWillUpdateVisibility 1114
#define EventWindowWillUseStandardFrame 1115
#define EventMenuWillOpen 1116
#define EventMenuDidOpen 1117
#define EventMenuDidClose 1118
#define EventMenuWillSendAction 1119
#define EventMenuDidSendAction 1120
#define EventMenuWillHighlightItem 1121
#define EventMenuDidHighlightItem 1122
#define EventMenuWillDisplayItem 1123
#define EventMenuDidDisplayItem 1124
#define EventMenuWillAddItem 1125
#define EventMenuDidAddItem 1126
#define EventMenuWillRemoveItem 1127
#define EventMenuDidRemoveItem 1128
#define EventMenuWillBeginTracking 1129
#define EventMenuDidBeginTracking 1130
#define EventMenuWillEndTracking 1131
#define EventMenuDidEndTracking 1132
#define EventMenuWillUpdate 1133
#define EventMenuDidUpdate 1134
#define EventMenuWillPopUp 1135
#define EventMenuDidPopUp 1136
#define EventMenuWillSendActionToItem 1137
#define EventMenuDidSendActionToItem 1138
#define EventWebViewDidStartProvisionalNavigation 1139
#define EventWebViewDidReceiveServerRedirectForProvisionalNavigation 1140
#define EventWebViewDidFinishNavigation 1141
#define EventWebViewDidCommitNavigation 1142
#define EventWindowFileDraggingEntered 1143
#define EventWindowFileDraggingPerformed 1144
#define EventWindowFileDraggingExited 1145

#define MAX_EVENTS 1146


#endif