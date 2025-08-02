标签：[[物理]] [[化学]] [[热力学]] 

# 推导

由[[自由能]]定义：
$$
G = H - TS \quad H = U + PV
$$
两侧微分：
$$
\mathrm{d}G = \mathrm{d}H - T\mathrm{d}S - S\mathrm{d}T
$$
$$
\mathrm{d}H = \mathrm{d}U + V\mathrm{d}P + P\mathrm{d}V
$$
又因为
$$
\delta G = P\mathrm{d}V + \delta w_{非}
$$
联立上式：
$$
\mathrm{d}G = -\delta w_{\text{非}} + V \mathrm{d}P - S \mathrm{d}T
$$
由于等温等压，所以
$$
\mathrm{d}G = -\delta w_{非}
$$
因此我们有结论：吉布斯自由能的相反数就是最大的额外功！

对于电池来说，根据[[电势#静电场环路定理 到功]]的解释，我们有
$$
\delta w_{非} = E_{池}q = E_{池}nF
$$
其中$F$为$1\ mol$电子所携带的电量

再根据[[van't Hoff等温式]]，我们有：
$$
\ln K = \frac{n E_{池}F}{RT}
$$

当浓度不为标准热力学浓度的时候
$$
E = E^{\circ} － \frac{RT}{nF}\ln{\frac{[Red]^c}{[Ox]^a}}
$$
当我们取热力学标准状态$T=298.15K$：
$$
E = E^{\circ}－ \frac{0.0592}{n}\lg{\frac{[Red]^c}{[Ox]^a}}
$$